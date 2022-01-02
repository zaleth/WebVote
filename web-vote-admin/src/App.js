import logo from './logo.svg';
import './App.css';
import React from 'react';
import Parse from './index';

class ListElections extends React.Component {

  constructor(props) {
    super(props)
    this.state = { eList: [], idToEdit: null}
    this.addElection = this.addElection.bind(this)
    this.editElection = this.editElection.bind(this)
    this.deleteElection = this.deleteElection.bind(this)
    this.updateElection = this.updateElection.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
  }

  componentDidMount() {
    const Election = Parse.Object.extend('Election')
    const query = new Parse.Query(Election)
    const list = []

    query.get().then((elem) => {
      list.push(elem)
    })

    this.setState( {eList: list} )

  }

  addElection() {
    this.setState( {idToEdit: ""})
  }

  doAddElection() {
    const list = this.state.eList;
    list.push("Election " + list.length)
    this.setState( { eList: list} ) // force a redraw
    console.log("Adding election")
  }

  updateElection(id, position, candidates, votes) {
    const list = this.state.eList;
    if(id === "") {
      list.push( {id: "ID " + list.length, pos: position, cList: candidates, numVotes: votes} )
    } else {

    }
    this.setState( {idToEdit: null})
  }

  cancelUpdate() {
    this.setState( {idToEdit: null})
  }

  editElection(id) {
    this.setState( {idToEdit: id} )
  }

  deleteElection(id) {
    console.log("Delete " + id)
    const list = this.state.eList
    const index = list.indexOf(id)
    if(index > -1) {
      list.splice(index, 1)
      this.setState( {eList: list})
    } else {
      console.log("ID " + id + " not found")
    }
  }

  render() {
    return (
      <div className="list">
      <ul>
        {this.state.eList.map( (e) =>
        <Election elem={e} edit={this.editElection} del={this.deleteElection}/> )}
      </ul>
      { this.state.idToEdit !== null ?
      <EditElection id={this.state.idToEdit} update={this.updateElection} cancel={this.cancelUpdate}/> :
      <button name="addElection" onClick={this.addElection}>Add election</button> }
      </div>
    )
  }

}

class EditElection extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      position: "",
      candidates: [],
      votes: 1
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const Election = Parse.Object.extend('Election')
    const query = new Parse.Query(Election)
    const list = []

    if(this.state.id === "")
      // create new election, nothing to load
      ;
    else {
      query.get(this.state.id).then((elem) => {
        this.setState( { position: elem.pos, candidates: elem.cList, votes: elem.numVotes} )
      })
    }
  }


  handleChange(event) {
    const target = event.target.name

    if(target === "name") {
      this.setState( {position: event.target.value})
    } else if(target === "votes") {
      this.setState( {votes: parseInt(event.target.value)} )
    }
  }

  handleSubmit(event) {
    event.ignoreDefault()
    const Election = Parse.Object.extend('Election')
    const elem = new Election()
    
    if(this.state.id !== "")
      elem.set('id', this.state.id)
    elem.set('pos', this.state.position)
    elem.set('cList', this.state.candidates)
    elem.set('numVotes', this.state.votes)

    elem.save.then((id) => {
      this.props.update(this.state.id, this.state.position,
        this.state.candidates, this.state.votes)
      },
      (error) => {
        console.log(error)
        this.props.cancel()
      })
  }

  render() {
    return (
    <div>
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={this.state.position} onChange={this.handleChange} />
          </label>
          <ListOfCandidates list={this.state.candidates}/>
          <label>
            Votes:
            <input type="text" name="votes" value={this.state.votes} onChange={this.handleChange} />
          </label>
        </form>
      </div>
      <div>
        <button onClick={this.handleSubmit}>Save changes</button>
        <button onClick={this.props.cancel}>Cancel changes</button>
      </div>
    </div>
    )
  }
}

class ListOfCandidates extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    return(
      <ul>

      </ul>
    )
  }
}

class Election extends React.Component {

  render() {
    console.log(this.props.elem)
    return <li key={this.props.elem.id}>
      {this.props.elem.pos}
      <button onClick={() => this.props.edit(this.props.elem.id)} >Edit</button>
      <button onClick={() => this.props.del(this.props.elem.id)}>Delete</button>
    </li>
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ListElections />
      </header>
    </div>
  );
}

export default App;
