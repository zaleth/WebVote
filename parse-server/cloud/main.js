// Cloud Code entry point

// --- BEGIN ADMIN FUNCTIONS ---

Parse.Cloud.define('addElectionDay', async (request) => {
    const EDay = Parse.Object.extend('ElectionDay');
    const ed = new EDay();
    let date = request.params.date;
    if(typeof date != Date)
      date = new Date(date);
    console.log("Saving " + request.params.name + "@" + request.params.date);
    ed.set('edName', request.params.name);
    ed.set('edDate', request.params.date);
    const res = await ed.save(null, {useMasterKey: true});
    return res;
},{
    fields: ['name', 'date']
});

Parse.Cloud.define('deleteElectionDay', (request) => {
    const EDay = Parse.Object.extend('ElectionDay');
    const query = new Parse.Query(EDay);
    query.get(request.params.id).then( (e) => {
        e.destroy({useMasterKey: true});
    }, (error) => {
        console.log(error);
    });
},{
    fields: {
        id: {
            required: true,
            type: String
        }
    }
});

Parse.Cloud.define('addElection', (request) => {
    const Election = Parse.Object.extend('Election');
    const e = new Election();
    e.set('edID', request.params.edID);
    e.set('name', request.params.name);
    e.set('votes', request.params.votes);
    e.set('open', true);
    e.save({useMasterKey: true}).then( (res) => {
      //e.id = res.id;
      //console.log(res.toJSON());
      ret = res.toJSON();
      ret.className='Election';
      console.log(ret);
        return ret;
    }, (error) => {
        console.log(error);
    });
},{
    fields: {
        edID: {
            required: true,
            type: String
        },
        name: {
            required: true,
            type: String
        },
        votes: {
            required: true,
            type: Number
        }
    }
});

Parse.Cloud.define('deleteElection', (request) => {
    const Elec = Parse.Object.extend('Election');
    const query = new Parse.Query(Elec);
    query.get(request.params.elId).then( (e) => {
        if(e.get('edID') === request.params.edId) {
            e.destroy({useMasterKey: true});
            return "Done";
        } else {
            return "Election belongs to another election day";
        }
    }, (error) => {
        console.log(error);
        return error;
    });

},{
    fields: {
        edId: {
            required: true,
            type: String
        },
        elId: {
            required:true,
            type: String
        }
    }
});

Parse.Cloud.define('addCandidate', async (request) => {
    const Cand = Parse.Object.extend("Candidate");
    const e = new Cand();
    e.set('elID', request.params.elId);
    e.set('name', request.params.name);
    await e.save({useMasterKey: true});
    return e.id;

},{
    fields: {
        elId: {
            required: true,
            type: String
        },
        name: {
            required: true,
            type: String
        },
    }
});

Parse.Cloud.define('deleteCandidate', async (request) => {
    const Cand = Parse.Object.extend('Candidate');
    const query = new Parse.Query(Cand);
    query.get(request.params.cId).then( (e) => {
        if(e.get('elID') === request.params.elId) {
            e.destroy({useMasterKey: true});
            return "Done";
        } else {
            return "Candidate does not belong to this election";
        }
    }, (error) => {
        console.log(error);
    });

},{
    fields: {
        elId: {
            required: true,
            type: String
        },
        cId: {
            required: true,
            type: String
        },

    }
});

Parse.Cloud.define('getAllUsers', async (request) => {
    const query = new Parse.Query(Parse.User);
    const res = await query.find(null, {useMasterKey: true});
    return res;
});

Parse.Cloud.define('addUser', async (request) => {
    const admin = request.user;
    //console.log(admin);
    //console.log(admin.id);
    const user = new Parse.User();
    user.setUsername(request.params.name);
    user.setPassword(request.params.pass);
    const res = await user.signUp(request.params.name, request.params.pass, null, {useMasterKey: true});
    //console.log(Parse.User.current().id);
    await Parse.User.logIn(request.params.name, request.params.pass);
    const u = await Parse.User.current();
    console.log(u);
    let acl = user.getACL();
    if(!acl) acl = new Parse.ACL(user);
    acl.setPublicReadAccess(true);
    acl.setReadAccess(admin.id, true);
    acl.setWriteAccess(admin.id, true);
    user.setACL(acl, null, {useMasterKey: true});
    await user.save(null, {useMasterKey: true});
    Parse.User.logOut();
    return res;
},{
    fields: ['name', 'pass']
});

Parse.Cloud.define('changeUserPassword', async (request) => {
    const query = new Parse.Query(Parse.User);
    const res = await query.get(request.params.id);
    res.setPassword(request.params.newPass, {useMasterKey: true});
    const ret = await res.save(null, {useMasterKey: true});
    return ret;
},{
    fields: ['id', 'newPass']
});

Parse.Cloud.define('deleteUser', async (request) => {
    const query = new Parse.Query(Parse.User);
    const res = await query.get(request.params.id);
    await res.destroy({useMasterKey: true});
    return "Done";
},{
    fields: ['id']
});

// --- END ADMIN FUNCTIONS ---

// --- BEGIN OFFICE FUNCTIONS ---

Parse.Cloud.define('genVoterId', async (request) => {
    const Voter = Parse.Object.extend('Voter');
    const v = new Voter();
    v.set('edID', request.params.edId);
    const res = await v.save({useMasterKey: true});
    return res.id;

},{
    fields: ['edId']
});

Parse.Cloud.define('eraseVoters', async (request) => {
    const Voter = Parse.Object.extend('Voter');
    const query = new Parse.Query(Voter);
    query.equalTo('edID', request.params.edId);
    query.limit(1000);
    query.find().then( (res) => {
        res.forEach( (e) => {
            const Vote = Parse.Object.extend('Vote');
            const iQuery = new Parse.Query(Vote);
            iQuery.equalTo('vID', e.id);
            iQuery.find().then( (ret) => {
                ret.forEach( (v) => {
                    v.destroy({useMasterKey: true});
                });
            }, (error) => {});
            e.destroy({useMasterKey: true});
        });
    }, (error) => {});
    return "Done";
},{
    fields: ['edId']
});

Parse.Cloud.define('openElection', async (request) => {
    const Elec = Parse.Object.extend('Election');
    const query = new Parse.Query(Elec);
    const e = await query.get(request.params.elID);
    e.set('open', request.params.isOpen);
    await e.save({useMasterKey: true});
    return e.get('open');
},{
    fields: ['elID', 'isOpen']
});

Parse.Cloud.define('resetVotes', async (request) => {
    const Elec = Parse.Object.extend('Election');
    let query = new Parse.Query(Elec);
    let ret = await query.get(request.params.elID);
    if(ret.get('open')) {
        console.log("Election", ret.id, "is open");
        return "Failed";
    }

    const Vote = Parse.Object.extend('Vote');
    query = new Parse.Query(Vote);
    query.equalTo('elID', request.params.elID);
    query.find().then( (res) => {
        res.forEach( (e) => {
          try {
            e.destroy({useMasterKey: true});
          } catch (error) {
            console.log(error);
          }
        });
    }, (error) => {
        console.log("Error clearing votes: " + error);
    });
    return "Done";
},{
    fields: ['elID']
});

// --- END OFFICE FUNCTIONS ---

// --- BEGIN VOTER FUNCTIONS ---

Parse.Cloud.define('registerVote', async (request) => {
    const elID = request.params.elID;
    const cID = request.params.cID;
    const vID = request.params.vID;

    // check that the election is open
    const Elec = Parse.Object.extend('Election');
    let query = new Parse.Query(Elec);
    let ret = await query.get(elID);
    const edID = ret.get('edID');
    if(! ret.get('open')) {
        console.log("Election", elID, "is closed");
        return "Failed";
    }

    // check that voter can vote in this election
    const Voter = Parse.Object.extend('Voter');
    query = new Parse.Query(Voter);
    ret = await query.get(vID);
    if(ret.get('edID') !== edID) {
        console.log(vID, "is not registered for", elID, "on", edID);
        return "Failed";
    }

    // check that candidate is in this election
    const Cand = Parse.Object.extend('Candidate');
    query = new Parse.Query(Cand);
    ret = await query.get(cID);
    if(ret.get('elID') !== elID) {
        console.log(cID, "is not running in", elID);
        return "Failed";
    }

    // cast vote
    const Vote = Parse.Object.extend('Vote');
    const vote = new Vote();
    vote.set('elID', elID);
    vote.set('cID', cID);
    vote.set('vID', vID);
    /*vote.save().then( (ret) => {
        return ret;
    }, (error) => {
        return error;
    });*/
    ret = await vote.save({useMasterKey: true});
    return ret;
},{
    fields: {
        elID: {
            required: true,
            type: String,
        },
        cID: {
            required: true,
            type: String,
        },
        vID: {
            required: true,
            type: String,
        },
    },
});

// --- END VOTER FUNCTIONS ---
