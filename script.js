//const APIurl = "https://jobs.github.com/api";//The GitHub Jobs site is deprecated since 2021!!! need to find another API...
//https://github.com/public-apis/public-apis <--Search for free APIs
const APIurl ="https://www.themuse.com/api/public/jobs?";//themuse API
const APIurlPage = "page=";


class MyApp extends React.Component{
    constructor(props){
      super(props);
      this.state={
          page:0,
          jobPage:0,
          jobNo:0,
          jobData5:[],
          jobData0020:[],
          jobData2140:[],
          jobData4150:[],
          radioSearch:["London, United Kingdom","Amsterdam, Netherlands","New York, NY","Berlin, Germany"],
          searchLocation:"London, United Kingdom",
          levelSearch:[false, false, false, false, false],
          levelURL:"",
          locationInput:"",
          topInput:"",
          searchCat:"",
          searchCom:"",
          searchNotice:"Loading...",
      }
      this.toMainPage=this.toMainPage.bind(this);
      this.toDetailPage=this.toDetailPage.bind(this);
      this.loadAllData=this.loadAllData.bind(this);
      this.getData=this.getData.bind(this);
      this.toJobPage=this.toJobPage.bind(this);
      this.nextJobPage=this.nextJobPage.bind(this);
      this.lastJobPage=this.lastJobPage.bind(this);
      this.handleJobPage=this.handleJobPage.bind(this);
      this.resetPage=this.resetPage.bind(this);
      this.changeLocation=this.changeLocation.bind(this);
      this.changelevel=this.changelevel.bind(this);
      this.handleLocationChange=this.handleLocationChange.bind(this);
      this.handleLocationSubmit=this.handleLocationSubmit.bind(this);
      this.handleTopChange=this.handleTopChange.bind(this);
      this.handleTopSubmit=this.handleTopSubmit.bind(this);
    }

    componentDidMount() {
        this.loadAllData("location="+this.state.searchLocation+"&");
    }

    loadAllData(url){
        this.getData(1, "5",url);
        this.getData(1, "0020",url);
        this.getData(2, "2140",url);
        this.getData(3, "4150",url);   
        console.log(this.state.searchCat);
        console.log(this.state.searchCom)
    }

    getData(page, state, criteria){
        fetch(APIurl + criteria + APIurlPage + page)
        .then((res) => res.json())
        .then((json) => {
            (state == "5")?
            this.setState({
                jobData5: json.results.slice(0,5)
            }):
            (state == "0020")?
            this.setState({
                jobData0020: json.results
            }):
            (state == "2140")?
            this.setState({
                jobData2140: json.results
            }):
            (state == "4150")?
            this.setState({
                jobData4150: json.results.slice(0,10)
            }):
            null;
            console.log(this.state.jobData5);
            (this.state.jobData5)? this.setState({searchNotice: "No job matches the search criteria."}):null;
        })
        .catch(error=>{
            log('Request failed', error)
        });
        console.log(APIurl + criteria + APIurlPage + page);
    }
    

    toDetailPage(event){
        this.setState({
            page:1,
            jobNo:event.currentTarget.id.charAt(3),
        })
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toMainPage(){
        this.setState({
            page:0,
        })
    }

    toJobPage(event){
        this.setState({
            jobPage:event.target.textContent-1,
        })
        this.handleJobPage(event.target.textContent-1);
    }

    nextJobPage(){
        this.setState({
            jobPage:this.state.jobPage+1,
        })
        this.handleJobPage(this.state.jobPage+1);
    }

    lastJobPage(){
        this.setState({
            jobPage:this.state.jobPage-1,
        })
        this.handleJobPage(this.state.jobPage-1);
    }

    handleJobPage(page){
        const dataGp = (page >=1 && page <=4)? this.state.jobData0020:
                       (page >=5 && page <=8)? this.state.jobData2140: this.state.jobData4150;
        const dataGpNo = ((page+1)%4 == 0)? 4: (page+1)%4;
        const startNo = (dataGpNo-1)*5;
        const endNo = dataGpNo*5;
        this.setState({
            jobData5: dataGp.slice(startNo, endNo),
        })
        console.log(dataGp.slice(startNo, endNo));
        console.log(dataGp);
        console.log(dataGpNo);
        console.log(startNo);
        console.log(endNo);
    }

    resetPage(){
        this.setState({
            jobPage:0,
        })
        this.handleJobPage(0);
    }

    changeLocation(event){
        this.setState({
            searchLocation: event.target.id.replace(/^[0-9]+/g,""),
        });
        (this.state.searchCat != "")?
        this.loadAllData("location="+event.target.id.replace(/^[0-9]+/g,"")+"&"+"category="+this.state.searchCat+"&"+this.state.levelURL):
        (this.state.searchCom != "")?
        this.loadAllData("location="+event.target.id.replace(/^[0-9]+/g,"")+"&"+"company="+this.state.searchCom+"&"+this.state.levelURL):
        this.loadAllData("location="+event.target.id.replace(/^[0-9]+/g,"")+"&"+this.state.levelURL);
        this.resetPage();
    }

    changelevel(event){
        let index = event.target.id.match(/\d+/g);
        let newList = this.state.levelSearch;
        newList[index] = (newList[index])? false: true;
        let lvList = ["Entry Level","Mid Level","Senior Level","management","Internship"];
        let lvURL = lvList.map((item,i)=>(newList[i])? "level="+item+"&":null).join('');
        this.setState({
            levelSearch: newList,
            levelURL: lvURL,
        });
        (this.state.searchCat != "")?
        this.loadAllData("location="+this.state.searchLocation+"&"+"category="+this.state.searchCat+"&"+lvURL):
        (this.state.searchCom != "")?
        this.loadAllData("location="+this.state.searchLocation+"&"+"company="+this.state.searchCom+"&"+lvURL):
        this.loadAllData("location="+this.state.searchLocation+"&"+lvURL);
    }

    handleLocationChange(event){
        this.setState({
            locationInput: event.target.value,
        })
    }

    handleLocationSubmit(event){
        event.preventDefault();
        let input = this.state.locationInput;
        fetch("searchdata.json")
        .then((res) => res.json())
        .then((json) => {
            let match =json.location.find(item=>JSON.stringify(item).toLowerCase().includes(input.toLowerCase()));//turn all to lowercase as input may have randon capital letters 
            console.log(match);
            let i = json.location.indexOf(match);
            console.log(i);
            if(i>-1){
            this.setState({
                searchLocation: json.location[i],
                locationInput: json.location[i],
            });
                (this.state.searchCat != "")?
                this.loadAllData("location="+match+"&"+"category="+this.state.searchCat+"&"+this.state.levelURL):
                (this.state.searchCom != "")?
                this.loadAllData("location="+match+"&"+"company="+this.state.searchCom+"&"+this.state.levelURL):
                this.loadAllData("location="+match+"&"+this.state.levelURL);
            }else{
            console.log("not found");
            alert("Location \""+input+"\" is not found.");
            }
        })
    }

    handleTopChange(event){
        this.setState({
            topInput: event.target.value,
        })
    }

    handleTopSubmit(event){
        event.preventDefault();
        let input = this.state.topInput;
        input = input.charAt(0).toUpperCase()+input.slice(1);
        fetch("searchdata.json")
        .then((res) => res.json())
        .then((json) => {
            let match =json.category.find(item=>JSON.stringify(item).toLowerCase().includes(input.toLowerCase()));
            console.log(match);
            let i = json.category.indexOf(match);
            console.log(i);
            if(i>-1){
                this.setState({
                    topInput:json.category[i],
                    searchCat:json.category[i],
                    searchCom:"",
                });
                this.loadAllData("category="+match+"&"+"location="+this.state.searchLocation+"&"+this.state.levelURL);
            }else{
                this.setState({
                    topInput:input,
                    searchCom:input,
                    searchCat:"",
                });
                this.loadAllData("company="+input+"&"+"location="+this.state.searchLocation+"&"+this.state.levelURL);
            }
        })
    }


    render(){
        const searchBar = (this.state.page==0)? 
                          <SearchBar 
                          handleTopChange={this.handleTopChange}
                          handleTopSubmit={this.handleTopSubmit}
                          topInput={this.state.topInput}
                          />:
                          null;
        const mainContent = ((this.state.page==0))?
                            <Main0 
                                jobPage={this.state.jobPage}
                                jobData5={this.state.jobData5}
                                toDetailPage={this.toDetailPage}
                                toJobPage={this.toJobPage}
                                nextJobPage={this.nextJobPage}
                                lastJobPage={this.lastJobPage}
                                radioSearch={this.state.radioSearch}
                                searchLocation={this.state.searchLocation}
                                changeLocation={this.changeLocation}
                                levelSearch={this.state.levelSearch}
                                changelevel={this.changelevel}
                                handleLocationChange={this.handleLocationChange}
                                handleLocationSubmit={this.handleLocationSubmit}
                                locationInput={this.state.locationInput}
                                searchNotice={this.state.searchNotice}
                            />: 
                            <Main1 
                                toMainPage={this.toMainPage}
                                jobData5={this.state.jobData5}
                                jobNo={this.state.jobNo}
                            />;
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
                <form id="search-bar" onSubmit={this.props.handleTopSubmit}>
                    <input placeholder="Title, companies, expertise or benefits" className="text-input" onChange={this.props.handleTopChange} value={this.props.topInput}/>
                    <button id="search-btn" type="submit">Search</button>
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

            <h2>Levels</h2>
            <ul id="levels-list">
            <li>
            <input type="checkbox" id="level0" name="Full-time" value="Full-time" onChange={this.props.changelevel} checked={this.props.levelSearch[0]}/>
            <label htmlFor="Full-time" className="location-label">Entry Level</label>
            </li>
            <li>
            <input type="checkbox" id="level1" name="Full-time" value="Full-time" onChange={this.props.changelevel} checked={this.props.levelSearch[1]}/>
            <label htmlFor="Full-time" className="location-label">Mid Level</label>
            </li>
            <li>
            <input type="checkbox" id="level2" name="Full-time" value="Full-time" onChange={this.props.changelevel} checked={this.props.levelSearch[2]}/>
            <label htmlFor="Full-time" className="location-label">Senior Level</label>
            </li>
            <li>
            <input type="checkbox" id="level3" name="Full-time" value="Full-time" onChange={this.props.changelevel} checked={this.props.levelSearch[3]}/>
            <label htmlFor="Full-time" className="location-label">Management</label>
            </li>
            <li>
            <input type="checkbox" id="level4" name="Full-time" value="Full-time" onChange={this.props.changelevel} checked={this.props.levelSearch[4]}/>
            <label htmlFor="Full-time" className="location-label">Internship</label>
            </li>
            </ul>
            
            <h2>Location</h2>
            <form id="search-location" onSubmit={this.props.handleLocationSubmit}>
                <input 
                placeholder="City, state, zip code or country"  
                className="text-input location-input" 
                onChange={this.props.handleLocationChange}
                value={this.props.locationInput}
                />
                <span className="material-icons-outlined input-icon">public</span>
            </form>
            <ul id="location-list">

                {this.props.radioSearch.map((item, index)=>
                  <li key={index+item}>
                      <input type="radio" id={index + item} name={item} value={item} onChange={this.props.changeLocation} checked={(item == this.props.searchLocation)? true:false}/>
                      <label htmlFor={index + item} className="location-label">{item}</label>
                  </li>
                )}

            </ul>
            </div>
            <JobList
                jobPage={this.props.jobPage}
                jobData5={this.props.jobData5}
                toDetailPage={this.props.toDetailPage}
                toJobPage={this.props.toJobPage}
                nextJobPage={this.props.nextJobPage}
                lastJobPage={this.props.lastJobPage}
                searchNotice={this.props.searchNotice}
            />
            </div>
    )
}}

class Main1 extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        let data = this.props.jobData5[this.props.jobNo];
        const companyName = (!data)? null: data.company.name;
        const title = (!data)? null: data.name;
        const location = (!data)? null: data.locations[0].name;
        const level = (!data)? null: <p className="job-ft">{data.levels[0].name}</p>;
        const date1 = new Date();//get today
        const date2 = (!data)? null: new Date(data.publication_date);//get publication date
        const diffTime = (!date2)? null: Math.abs(date2 - date1);
        const diffDays = (!diffTime)? null: Math.ceil(diffTime / (1000 * 60 * 60 * 24));//calc ? days ago
        const contents = (!data)? null: data.contents;
        const toURL = (!data)? null: data.refs.landing_page;
        console.log(data);

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
                <div className="url-btn">
                <a href={toURL} >
                    <span className="material-icons-outlined url-icon">
                        east
                    </span>
                    themuse.com
                </a>
                </div>
            </div>
            <div id="job-details">
                <div className="job-title-div">
                <h3>{title}</h3>
                {level}
                </div>
                <span className="icon-text-gp">
                    <span className="material-icons-outlined">schedule</span>
                            {diffDays} days ago
                </span>
                <div className="com-info-div">
                {/*
                <div className="com-img-div-1">
                    <img src=""/>
                 </div>
                */}
                 <div className="job-text-div1">
                    <p className="job-com">{companyName}</p>
                    <span className="icon-text-gp">
                    <span className="material-icons-outlined">public</span>
                        {location}
                    </span>
                </div>
                </div>
                <div className="content-div" dangerouslySetInnerHTML={{__html: contents}}></div>
            </div>
            </div>
        )
    }
}



class JobList extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        const btnLeft = (this.props.jobPage == 0)? "page-btn  hidden": "page-btn";
        const btnRight = (this.props.jobPage == 9)? "page-btn  hidden": "page-btn";
        const btn1 = (this.props.jobPage <2)?"page-btn page-btn-active hidden":
                     (this.props.jobPage == 0)?"page-btn page-btn-active":"page-btn";
        const btn10 = (this.props.jobPage >7)?"page-btn page-btn-active hidden":
                      (this.props.jobPage == 9)?"page-btn page-btn-active":"page-btn";
        const horizLeft = (this.props.jobPage < 3)? "material-icons-outlined page-btn-icon hidden": "material-icons-outlined page-btn-icon";
        const horizRight = (this.props.jobPage > 6)? "material-icons-outlined page-btn-icon hidden": "material-icons-outlined page-btn-icon";
        const btnGp1 = (this.props.jobPage == 0)?"page-btn page-btn-active":"page-btn";
        const btnGp2 = (0< this.props.jobPage && this.props.jobPage<9)?"page-btn page-btn-active":"page-btn";
        const btnGp3 = (this.props.jobPage == 9)?"page-btn page-btn-active":"page-btn";
        const btnGp1Text = (this.props.jobPage <2)?"1":
                           (this.props.jobPage==9)?"8":parseInt(this.props.jobPage);
        const btnGp2Text = (this.props.jobPage ==0)?"2":
                           (this.props.jobPage == 9)?"9":parseInt(this.props.jobPage)+1;
        const btnGp3Text = (this.props.jobPage >7)?"10":
                           (this.props.jobPage==0)?"3":parseInt(this.props.jobPage)+2;
        const showJobs= (i) =>(this.props.jobData5[i])?<Jobs jobData5={this.props.jobData5} jobData={this.props.jobData5[i]} toDetailPage={this.props.toDetailPage}/>: null;
        return(
            <div id="jobs-div">
            <div id="job-list">
                
                {(showJobs(0))?showJobs(0):<div className="job-list-item search-notice">{this.props.searchNotice}</div>}
                {showJobs(1)}
                {showJobs(2)}
                {showJobs(3)}
                {showJobs(4)}
           
            </div>
            {(showJobs(0))?          
            <div id="page-btn-div">
                <button className={btnLeft} onClick={this.props.lastJobPage}>
                    <span className="material-icons-outlined page-btn-icon">
                        chevron_left
                    </span>
                </button>
                <button className={btn1} onClick={this.props.toJobPage}>1</button>
                <span className={horizLeft} >more_horiz</span>
                <button className={btnGp1} onClick={this.props.toJobPage}>{btnGp1Text}</button>
                <button className={btnGp2} onClick={this.props.toJobPage}>{btnGp2Text}</button>
                <button className={btnGp3} onClick={this.props.toJobPage}>{btnGp3Text}</button>
                <span className={horizRight}>more_horiz</span>
                <button className={btn10} onClick={this.props.toJobPage}>10</button>
                <button className={btnRight} onClick={this.props.nextJobPage}>
                    <span className="material-icons-outlined page-btn-icon">
                        chevron_right
                    </span>
                </button>
            </div>:
            null
            }
            </div>
        )
    }
}

class Jobs extends React.Component{
    constructor(props){
      super(props);
    }

    render(){
        let data = this.props.jobData;
        const companyName = (!data)? null: data.company.name;
        const title = (!data)? null: data.name;
        const location = (!data)? null: data.locations[0].name;
        const level = (!data)? null: <p className="job-ft">{data.levels[0].name}</p>;
        const date1 = new Date();//get today
        const date2 = (!data)? null: new Date(data.publication_date);//get publication date
        const diffTime = (!date2)? null: Math.abs(date2 - date1);
        const diffDays = (!diffTime)? null: Math.ceil(diffTime / (1000 * 60 * 60 * 24));//calc ? days ago
        const divID = this.props.jobData5.indexOf(this.props.jobData);

        return(
            <button className="job-list-item" onClick={this.props.toDetailPage} id={"job"+divID}>
                {/*
                <div className="com-img-div">
                    <img src=""/>
                </div>
                */}
                <div className="job-text-div">
                    <p className="job-com">{companyName}</p>
                    <p className="job-title">{title}</p>
                    {level}
                </div>
                <div className="job-lt-div">
                    <span className="icon-text-gp">
                    <span className="material-icons-outlined">public</span>
                        {location}
                    </span>
                    <span className="icon-text-gp">
                        <span className="material-icons-outlined">schedule</span>
                            {diffDays} days ago
                    </span>
                </div> 
            </button>
        )
    }
}

ReactDOM.render(<MyApp />, document.getElementById('myApp'));


/*
const ddd = "";
const eee = ddd.replace(/([a-z]|[A-Z][A-Z])(Z)/g,'$1"'+','+'"$2');
console.log(eee);
*/
