const APIurl = "API: https://jobs.github.com/api";

class MyApp extends React.Component{
    constructor(props){
      super(props);
      this.state={
          page:0,
      }
      this.toMainPage=this.toMainPage.bind(this);
    }

    toMainPage(){
        this.setState({
            page:0,
        })
    }

    render(){
        const searchBar = (this.state.page==0)? <SearchBar />:null;
        const mainContent = ((this.state.page==0))?<Main0 />: <Main1 toMainPage={this.toMainPage}/>;
        return(
            <div id="myApp-div"> 
                <header>
                    <h1><b>Github</b> Jobs</h1>
                    {searchBar}
                </header>
                <main>
                    {mainContent}
                </main>
            </div>
        )
    }
}
class SearchBar extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        return(
            <div id="search-bar-div">
                <form id="search-bar">
                    <input placeholder="Title, companies, expertise or benefits" className="text-input"/>
                    <button id="search-btn">Search</button>
                    <span className="material-icons-outlined input-icon">work_outline</span>
                </form>
            </div>
        )
    }
}
class Main0 extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        return(
            <div id="main0">
            <div id="left-div">
            <input type="checkbox" id="Full-time" name="Full-time" value="Full-time"/>
            <label htmlFor="Full-time" className="location-label">Full time</label>
            <h2>Location</h2>
            <form id="search-location">
                <input placeholder="City, state, zip code or country"  className="text-input location-input"/>
                <span className="material-icons-outlined input-icon">public</span>
            </form>
            <ul id="location-list">
                <Locations/>
                <Locations/>
                <Locations/>
                <Locations/>
            </ul>
            </div>
            <JobList/>
            </div>
    )
}}

class Main1 extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        return(
            <div id="main1">
            <div id="left-div1"> 
                <button className="icon-text-gp back-btn" onClick={this.props.toMainPage}>
                    <span className="material-icons-outlined">
                        keyboard_backspace
                    </span>
                    Back to search
                </button>
                <h2>How to apply</h2>
                <p>Please email a copy of your resume and online portfolio to <em>wes@kasisto.com</em> & CC <em>eric@kasisto.com</em></p>
            </div>
            <div id="job-details">
                <div className="job-title-div">
                <h3>Front-End Software Engineer</h3>
                <span className="job-ft">Full time</span>
                </div>
                <span className="icon-text-gp">
                    <span className="material-icons-outlined">schedule</span>
                            5 days ago
                </span>
                <div className="com-info-div">
                <div className="com-img-div-1">
                    <img src=""/>
                 </div>
                 <div className="job-text-div">
                    <p className="job-com">Kasisto</p>
                    <span className="icon-text-gp">
                    <span className="material-icons-outlined">public</span>
                        New York
                    </span>
                </div>
                </div>
                <p>Some text here...</p>
            </div>
            </div>
        )
    }
}


class Locations extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        return(
            <li>
                <input type="radio" id="London" name="London" value="London"/>
                <label htmlFor="London" className="location-label">London</label>
            </li>
        )
    }
}


class JobList extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        return(
            <div id="jobs-div">
            <div id="job-list">
                <Jobs />
                <Jobs />
                <Jobs />
                <Jobs />
                <Jobs />
            </div>
            <div id="page-btn-div">
                <button className="page-btn">
                    <span className="material-icons-outlined page-btn-icon">
                        chevron_left
                    </span>
                </button>
                <button className="page-btn">1</button>
                <button className="page-btn page-btn-active ">2</button>
                <button className="page-btn">3</button>
                <span className="material-icons-outlined page-btn-icon">more_horiz</span>
                <button className="page-btn">10</button>
                <button className="page-btn">
                    <span className="material-icons-outlined page-btn-icon">
                        chevron_right
                    </span>
                </button>
            </div>
            </div>
        )
    }
}

class Jobs extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        return(
            <div className="job-list-item">
                <div className="com-img-div">
                    <img src=""/>
                 </div>
                 <div className="job-text-div">
                    <p className="job-com">Kasisto</p>
                    <p className="job-title">Front-End Software Engineer</p>
                    <p className="job-ft">Full time</p>
                </div>
                <div className="job-lt-div">
                    <span className="icon-text-gp">
                    <span className="material-icons-outlined">public</span>
                        New York
                    </span>
                    <span className="icon-text-gp">
                        <span className="material-icons-outlined">schedule</span>
                            5 days ago
                    </span>
                </div> 
            </div>
        )
    }
}

ReactDOM.render(<MyApp />, document.getElementById('myApp'));