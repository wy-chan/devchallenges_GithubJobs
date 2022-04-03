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
          recentSearch:["London","Amsterdam","New York","Berlin"],
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
    }

    componentDidMount() {
        this.loadAllData();
    }

    loadAllData(){
        this.getData(1, "5");
        this.getData(1, "0020");
        this.getData(2, "2140");
        this.getData(3, "4150");   
    }

    getData(page, state){
        fetch(APIurl + APIurlPage+page)
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
        })
        .catch(error=>{
            log('Request failed', error)
        });
    }
    

    toDetailPage(event){
        this.setState({
            page:1,
            jobNo:event.currentTarget.id.charAt(3),
        })
        
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
        handleJobPage(0);
    }

    render(){
        const searchBar = (this.state.page==0)? 
                          <SearchBar />:
                          null;
        const mainContent = ((this.state.page==0))?
                            <Main0 
                                jobPage={this.state.jobPage}
                                jobData5={this.state.jobData5}
                                toDetailPage={this.toDetailPage}
                                toJobPage={this.toJobPage}
                                nextJobPage={this.nextJobPage}
                                lastJobPage={this.lastJobPage}
                                recentSearch={this.state.recentSearch}
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
            <label htmlFor="Full-time" className="location-label">Remote</label>
            
            <h2>Location</h2>
            <form id="search-location">
                <input placeholder="City, state, zip code or country"  className="text-input location-input"/>
                <span className="material-icons-outlined input-icon">public</span>
            </form>
            <ul id="location-list">

                {this.props.recentSearch.map((item, index)=>
                  <li key={index+item}>
                      <input type="radio" id={index + item} name="London" value="London"/>
                      <label htmlFor="London" className="location-label">{item}</label>
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
        const remote = (location == 'Flexible / Remote')?<span className="job-ft">Remote</span>:null;
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
                {remote}
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

        return(
            <div id="jobs-div">
            <div id="job-list">
                <Jobs jobData5={this.props.jobData5} jobData={this.props.jobData5[0]} toDetailPage={this.props.toDetailPage}/>
                <Jobs jobData5={this.props.jobData5} jobData={this.props.jobData5[1]} toDetailPage={this.props.toDetailPage}/>
                <Jobs jobData5={this.props.jobData5} jobData={this.props.jobData5[2]} toDetailPage={this.props.toDetailPage}/>
                <Jobs jobData5={this.props.jobData5} jobData={this.props.jobData5[3]} toDetailPage={this.props.toDetailPage}/>
                <Jobs jobData5={this.props.jobData5} jobData={this.props.jobData5[4]} toDetailPage={this.props.toDetailPage}/>
           
            </div>
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
        let data = this.props.jobData;
        const companyName = (!data)? null: data.company.name;
        const title = (!data)? null: data.name;
        const location = (!data)? null: data.locations[0].name;
        const remote = (location == 'Flexible / Remote')?<p className="job-ft">Remote</p>:null;
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
                    {remote}
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