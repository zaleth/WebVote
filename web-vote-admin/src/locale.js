
import React from "react";

const data = {
    en: {
        longName: "English",
        locale: "en",
        pickLang: "Choose language",
        login: "Login",
        webVoteAdmin: "WebVote Admin",
        electionDays: "Election days",
        addElectionDay: "Add election day",
        addElection: "Add election",
        addCandidate: "Add candidate",
        addUser: "Add user",
        logout: "Logout",
        userAdmin: "User administration",
        delete: "Delete",
        cancel: "Cancel",
        change: "Change",
        name: "Name",
        date: "Date",
        votes: "Votes",
        password: "Password",
        passAgain: "Repeat password",
        newPass: "New password",
    },
    sv: {
        longName: "Svenska",
        locale: "sv",
        pickLang: "Välj språk",
        login: "Logga in",
        webVoteAdmin: "WebVote Administration",
        electionDays: "Valdagar",
        addElectionDay: "Lägg till valdag",
        addElection: "Lägg till omröstning",
        addCandidate: "Lägg till kandidat",
        addUser: "Skapa användare",
        logout: "Logga ut",
        userAdmin: "Användaradministration",
        delete: "Ta bort",
        cancel: "Ångra",
        change: "Ändra",
        name: "Namn",
        date: "Datum",
        votes: "Röster",
        password: "Lösenord",
        passAgain: "Repetera lösenord",
        newPass: "Nytt lösenord",
    }
};

const longText = { en: 'English', sv: 'Svenska' };

export class LocalePicker extends React.Component {

    static ref = null;

    static getString(name) {
        return this.ref.getString(name);
    }

    constructor(props) {
        super(props);
        this.state = { language: props.locale };
        this.handleLocaleChange = this.handleLocaleChange.bind(this);
        this.onLocaleChange = props.onChangeLocale;
        LocalePicker.ref = this;
    }
  
    handleLocaleChange(e) {
      e.preventDefault();
      //console.log("New locale", e.target.value);
      this.setState({ language: e.target.value }, () => {this.onLocaleChange(this.state.language)});
    }
    
    getString(name) {
        return data[this.state.language][name];
    }

    render() {
        //strings.setLanguage(this.state.language);
        //console.log(strings.getLanguage(strings), this.state.language);
        //console.log(data[this.state.language].pickLang);
        return(
            <div>
                {data[this.state.language].pickLang} <select onChange={this.handleLocaleChange}>
                {Object.keys(data).map( (e) => {
                    //console.log(e, longText[e], data[e].longName);
                    return(<option key={e} value={e}>{data[e].longName}</option>);
                })}
                </select>
            </div>
        );
    }
}
