// Cloud Code entry point

Parse.Cloud.define('hello', async (request) => {
    return "world";
});

Parse.Cloud.define('addElectionDay', async (request) => {
    const EDay = Parse.Object.extend('ElectionDay');
    const ed = new EDay();
    console.log("Saving " + request.params.name + "@" + request.params.date);
    ed.set('edName', request.params.name);
    ed.set('edDate', request.params.date);
    const res = await ed.save();
    return res;
},{
    fields: {
        name: {
            required: true,
            type: String
        },
        date: {
            required: true,
            type: String
        }
    }
});

Parse.Cloud.define('deleteElectionDay', (request) => {
    const EDay = Parse.Object.extend('ElectionDay');
    const query = new Parse.Query(EDay);
    query.get(request.params.id).then( (e) => {
        e.destroy();
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

Parse.Cloud.define('wipeDB', (request) => {
    const EDay = Parse.Object.extend('ElectionDay');
    let query = new Parse.Query(EDay);
    query.find().then( (res) => {
        res.forEach( (e) => { e.destroy(); });
    }, (error) => {
        console.log(error);
    });

    const Elec = Parse.Object.extend('Election');
    query = new Parse.Query(Elec);
    query.find().then( (res) => {
        res.forEach( (e) => { e.destroy(); });
    }, (error) => {
        console.log(error);
    });

    const Cand = Parse.Object.extend('Candidate');
    query = new Parse.Query(Cand);
    query.find().then( (res) => {
        res.forEach( (e) => { e.destroy(); });
    }, (error) => {
        console.log(error);
    });

    const Vote = Parse.Object.extend('Vote');
    query = new Parse.Query(Vote);
    query.find().then( (res) => {
        res.forEach( (e) => { e.destroy(); });
    }, (error) => {
        console.log(error);
    });

    const Voter = Parse.Object.extend('Voter');
    query = new Parse.Query(Voter);
    query.find().then( (res) => {
        res.forEach( (e) => { e.destroy(); });
    }, (error) => {
        console.log(error);
    });

    return "Done";
});

Parse.Cloud.define('addElection', (request) => {
    const Election = Parse.Object.extend('Election');
    const e = new Election();
    e.set('edID', request.params.edID);
    e.set('name', request.params.name);
    e.set('votes', request.params.votes);
    e.set('cList', []);
    e.set('open', true);
    e.save().then( (id) => {
        return e.toJSON();
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
            type: String
        }
    }
});

Parse.Cloud.define('deleteElection', (request) => {
    const Elec = Parse.Object.extend('Election');
    const query = new Parse.Query(Elec);
    query.get(request.params.elId).then( (e) => {
        if(e.get('edID') === request.params.edId) {
            e.destroy();
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
    e.set('elID', request.params.elID);
    e.set('name', request.params.name);
    await e.save();
    return e.toJSON();

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
            e.destroy();
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

Parse.Cloud.define('genVoterId', async (request) => {
    const Voter = Parse.Object.extend('Voter');
    const v = new Voter();
    v.set('edID', request.params.edId);
    const res = await v.save();
    return res.id;

},{
    fields: ['edId']
});

Parse.Cloud.define('registerVote', async (request) => {
    const Vote = Parse.Object.extend('Vote');
    const vote = new Vote();
    vote.set('elID', request.params.elID);
    vote.set('cID', request.params.cID);
    vote.set('vID', request.params.vID);
    /*vote.save().then( (ret) => {
        return ret;
    }, (error) => {
        return error;
    });*/
    const ret = await vote.save();
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