// HttpClient for get requests
let HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        };
        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send(null );
    }
};
let client = new HttpClient();

// Variable for settings values from back-end
class Settings {
    constructor() {
        this._countries = [];
        this._injuries = [];
        this._assistances = [];
        this._educations = [];
        this._ages=[];
    }
    get countries() {
        return this._countries;
    }
    set countries(x) {
        this._countries = x;
    }

    get injuries() {
        return this._injuries;
    }
    set injuries(x) {
        this._injuries = x;
    }

    get assistances() {
        return this._assistances;
    }
    set assistances(x) {
        this._assistances = x;
    }

    get educations() {
        return this._educations;
    }
    set educations(x) {
        this._educations = x;
    }

    get ages() {
        return this._ages;
    }
    set ages(x) {
        this._ages = x;
    }
}
let settings = new Settings();

// Current settings as shown in html and their respective settable functions
let currentSettings = {
    gender: "",
    typeOfFA: "",
    injury: "",
    assistance: "",
    age: "",
    country: "",
    from: "",
    to: "",
    education: ""
};

// Things to do when a filter value is updated
function setTypeOfFA(){
    let element = document.getElementById("settingFA");
    currentSettings.typeOfFA = element.options[element.selectedIndex].value;
}

function setCountry(){
    let element = document.getElementById("settingCountry");
    currentSettings.country = element.options[element.selectedIndex].value;
}
function setAge(){
    let element = document.getElementById("settingAge");
    currentSettings.age = element.options[element.selectedIndex].value;
}
function setGender(){
    let element = document.getElementById("settingGender");
    currentSettings.gender = element.options[element.selectedIndex].value;
}
function setAssistances(){
    let element = document.getElementById("settingAssistances");
    currentSettings.assistance = element.options[element.selectedIndex].value;
}
function setInjuries(){
    let element = document.getElementById("settingInjuries");
    currentSettings.injury = element.options[element.selectedIndex].value;
}
function setEducation(){
    let element = document.getElementById("settingEducation");
    currentSettings.education = element.options[element.selectedIndex].value;
}
function setFrom(){
    currentSettings.from = document.getElementById("settingFrom").value;
}
function setTo(){
    currentSettings.to = document.getElementById("settingTo").value;
}

function submitSettings(){
    updatedGraphs = false;
    document.getElementById('smallLoader').style.display = 'block';
    getCalculatedValues();
    getRawData();
}

// The values calculated by the back-end
let calculatedValues={
    "byAge": [],
    "byEducation": [],
    "byCorrectSolution": [],
    "byHospitalization": [],
    "byMap": [],
    "byGender": [],
    "byNumberTraining": [],
    "byInjury": [],
    "byAssistance": [],
    "byTraining": [],
    "byBlended": [],
    "byPercentProfHelp": 0
};
let rawValues=[];

// Heatmap
let map, directionsDisplay, directionsService;
let overlays = [];
TxtOverlay.prototype = new google.maps.OverlayView();

function initializeMap() {
    let directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = { zoom:3, mapTypeId: google.maps.MapTypeId.ROADMAP, center: new google.maps.LatLng(4.162709, 19.7901007) }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    directionsDisplay.setMap(map);
}

// Remember the current screen to see if charts should be updated or not
let currentScreen = "statistics";
let updatedGraphs = false;

// Initializes all elements
window.initAll();
function initAll(){
    // Make this element invisible, acts like a second tab instead
    document.getElementById('dataWrapper').style.display = 'none';
    document.getElementById('smallLoader').style.display = 'block';

    // Initialize map
    initializeMap();

    // Initialize settings by getting back-end information
    getAges();
    getAssistances();
    getInjuries();
    getCountries();
    getEducations();

    // Get all datapoints based on current filter settings
    getCalculatedValues();
    getRawData();
}

// Get list of assistances
function downloadFile(){
    document.getElementById('miniLoader').style.display = 'block';
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/raw' + setParams(), function(response) {
            let json = JSON.parse(response);
            let fields = Object.keys(json[0]);
            let replacer = function(key, value) { return value === null ? '' : value };
            let csv = json.map(function(row){
                return fields.map(function(fieldName){
                    return JSON.stringify(row[fieldName], replacer)
                }).join(',')
            });
            csv.unshift(fields.join(','));
            csv = csv.join('\r\n');

            let downloadLink = document.createElement("a");
            let blob = new Blob(["\ufeff", csv]);
            let url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "data.csv";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            document.getElementById('miniLoader').style.display = 'none';
        },
        currentSettings);
}

// Creates the query for get requests based on currentSettings
function setParams(){
    let query = "?";
    if (currentSettings.gender && !currentSettings.gender=="") {
        query += ((query=="?")? "" : "&") + "gender=" +  currentSettings.gender;
    }
    if (currentSettings.typeOfFA && !currentSettings.typeOfFA=="") {
        query += ((query=="?")? "" : "&") + "typeOfFA=" + currentSettings.typeOfFA;
    }
    if (currentSettings.injury && !currentSettings.injury=="") {
        query += ((query=="?")? "" : "&") + "injury=" +currentSettings.injury;
    }
    if (currentSettings.assistance && !currentSettings.assistance=="") {
        query += ((query=="?")? "" : "&") + "assistance=" +currentSettings.assistance;
    }
    if (currentSettings.age && !currentSettings.age=="") {
        query += ((query=="?")? "" : "&") +"age=" + currentSettings.age;
    }
    if (currentSettings.country && !currentSettings.country=="") {
        query += ((query=="?")? "" : "&") +"country=" + currentSettings.country;
    }
    if (currentSettings.from && !currentSettings.from=="") {
        query += ((query=="?")? "" : "&") +"from=" + currentSettings.from;
    }
    if (currentSettings.to && !currentSettings.to=="") {
        query += ((query=="?")? "" : "&") + "to=" +currentSettings.to;
    }
    if (currentSettings.education && !currentSettings.education=="") {
        query += ((query=="?")? "" : "&") + "education=" +currentSettings.education;
    }
    return query;
}

// Get raw data
function getRawData(){
    let elementExists = document.getElementById("mytable");
    if (elementExists != null){
        elementExists.remove();
    }
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/raw' + setParams(), function(response) {
            rawValues = JSON.parse(response);

            document.getElementById("amountOfCases").innerHTML = "There are <b>" + rawValues.length + "</b> cases that correspond to these settings.";

            let tbl=$("<table/>").attr("id","mytable");
            $("#dataWrapper").append(tbl);

            let tr="<tr>";
            let td1="<th>"+"age"+"</th>";
            let td2="<th>"+"assignDate"+"</th>";
            let td3="<th>"+"assistances"+"</th>";
            let td4="<th>"+"blendedTraining"+"</th>";
            let td5="<th>"+"confident"+"</th>";
            let td6="<th>"+"country"+"</th>";
            let td7="<th>"+"education"+"</th>";
            let td8="<th>"+"gender"+"</th>";
            let td9="<th>"+"hadFATraining"+"</th>";
            let td10="<th>"+"hosp. required"+"</th>";
            let td11="<th>"+"id"+"</th>";
            let td12="<th>"+"injuries"+"</th>";
            let td13="<th>"+"latitude"+"</th>";
            let td14="<th>"+"longitude"+"</th>";
            let td15="<th>"+"macAddress"+"</th>";
            let td16="<th>"+"numberOffATtraining"+"</th>";
            let td17="<th>"+"other provider"+"</th>";
            let td18="<th>"+"phNeeded"+"</th>";
            let td19="<th>"+"phTimeToArrive"+"</th>";
            let td20="<th>"+"phTypes"+"</th>";
            let td21="<th>"+"setting"+"</th>";
            let td22="<th>"+"trainingByRC"+"</th>";
            let td23="<th>"+"trainingByRC"+"</th></tr>";

            $("#mytable").append(tr+td1+td2+td3+td4+td5+td6+td7+td8+td9+td10+td11
                +td12+td13+td14+td15+td16+td17+td18+td19+td20+td21+td22+td23);

            for(let i=0;i<rawValues.length;i++)
            {
                let tr="<tr>";
                let td1="<td>"+rawValues[i]["age"]+"</td>";
                let td2="<td>"+rawValues[i]["assignDate"]+"</td>";
                let td3="<td>"+rawValues[i]["assistances"]+"</td>";
                let td4="<td>"+rawValues[i]["blendedTraining"]+"</td>";
                let td5="<td>"+rawValues[i]["confidentApplyingFA"]+"</td>";
                let td6="<td>"+rawValues[i]["country"]+"</td>";
                let td7="<td>"+rawValues[i]["education"]+"</td>";
                let td8="<td>"+rawValues[i]["gender"]+"</td>";
                let td9="<td>"+rawValues[i]["hadFATraining"]+"</td>";
                let td10="<td>"+rawValues[i]["hospitalisationRequired"]+"</td>";
                let td11="<td>"+rawValues[i]["id"]+"</td>";
                let td12="<td>"+rawValues[i]["injuries"]+"</td>";
                let td13="<td>"+rawValues[i]["latitude"]+"</td>";
                let td14="<td>"+rawValues[i]["longitude"]+"</td>";
                let td15="<td>"+rawValues[i]["macAddress"]+"</td>";
                let td16="<td>"+rawValues[i]["numberOffATtraining"]+"</td>";
                let td17="<td>"+rawValues[i]["otherTrainingProvider"]+"</td>";
                let td18="<td>"+rawValues[i]["phNeeded"]+"</td>";
                let td19="<td>"+rawValues[i]["phTimeToArrive"]+"</td>";
                let td20="<td>"+rawValues[i]["phTypes"]+"</td>";
                let td21="<td>"+rawValues[i]["setting"]+"</td>";
                let td22="<td>"+rawValues[i]["trainingByRC"]+"</td>";
                let td23="<td>"+rawValues[i]["trainingByRC"]+"</td></tr>";

                $("#mytable").append(tr+td1+td2+td3+td4+td5+td6+td7+td8+td9+td10+td11
                    +td12+td13+td14+td15+td16+td17+td18+td19+td20+td21+td22+td23);
            }
        document.getElementById('smallLoader').style.display = 'none';
        });
}

// Get statistics from back-end based on currentSettings
function getCalculatedValues(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/stats' +  setParams(), function(response) {
            calculatedValues = JSON.parse(response);
            if (currentScreen === "statistics"){
                updateGraphs();
                updatedGraphs = true;
            }
        });
}

// Get list of assistances
function getAges(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/ages', function(response) {
        settings.ages = JSON.parse(response);
        let select = document.getElementById("settingAges");
        for(let i = 0; i < settings.ages.length; i++){
            let assist = settings.ages[i];
            let el = document.createElement("option");
            el.textContent = assist;
            el.value = assist;
            select.appendChild(el);
        }
    });
}

// Get list of assistances
function getAssistances(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/assistances', function(response) {
        settings.assistances = JSON.parse(response);
        let select = document.getElementById("settingAssistances");
        for(let i = 0; i < settings.assistances.length; i++){
            let assist = settings.assistances[i];
            let el = document.createElement("option");
            el.textContent = assist;
            el.value = assist;
            select.appendChild(el);
        }
    });
}

// Get list of injuries
function getInjuries(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/injuries', function(response) {
        settings.injuries = JSON.parse(response);
        let select = document.getElementById("settingInjuries");
        for(let i = 0; i < settings.injuries.length; i++){
            let injury = settings.injuries[i];
            let el = document.createElement("option");
            el.textContent = injury;
            el.value = injury;
            select.appendChild(el);
        }
    });
}

// Get list of countries
function getCountries(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/countries', function(response) {
        settings.countries = JSON.parse(response);
        let select = document.getElementById("settingCountry");
        for(let i = 0; i < settings.countries.length; i++){
            let country = settings.countries[i];
            let el = document.createElement("option");
            el.textContent = country;
            el.value = country;
            select.appendChild(el);
        }
    });
}

// Get list of educations
function getEducations(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/educations', function(response) {
        settings.educations = JSON.parse(response);
        let select = document.getElementById("settingEducation");
        for(let i = 0; i < settings.educations.length; i++){
            let assist = settings.educations[i];
            let el = document.createElement("option");
            el.textContent = assist;
            el.value = assist;
            select.appendChild(el);
        }
    });
}

// Change elements when changing tabs (make it look like there are 2 pages)
function pressedStatisticsTab(){
    currentScreen = "statistics";
    document.getElementById("statisticsTab").className = "nav-item active";
    document.getElementById("dataTab").className = "nav-item";

    document.getElementById('swappableContent').style.display = 'block';
    document.getElementById('mapWrapper').style.display = 'block';
    document.getElementById('dataWrapper').style.display = 'none';
    if (updatedGraphs === false && currentScreen === "statistics"){
        updateGraphs();
        updatedGraphs = true;
    }
}

// Change elements when changing tabs
function pressedDataTab(){
    currentScreen = "data";
    document.getElementById("dataTab").className = "nav-item active";
    document.getElementById("statisticsTab").className = "nav-item";

    document.getElementById('swappableContent').style.display = 'none';
    document.getElementById('mapWrapper').style.display = 'none';
    document.getElementById('dataWrapper').style.display = 'block';
}

// update all graphs based on currentValues
function updateGraphs(){
    if(checkValidity("byAge","bar-age")){
        updateBarChart("bar-age", 'Amount of submissions by age', '<b>%yValue</b> people that submitted are <br>in the age range of <b>%name</b>', calculatedValues["byAge"]);
    }
    if(checkValidity("byEducation","bar-edu")){
        updateBarChart("bar-edu", 'Amount of submissions by education', '<b>%yValue</b> people that submitted have <br><b>%name</b> as their highest form of education', calculatedValues["byEducation"]);
    }


    if(checkValidity("byInjury","bar-injury")){
        updateBarChart("bar-injury", 'Amount of submissions of a specific injury type', '<b>%yValue</b> injuries where <br>of type <b>%name</b>', calculatedValues["byInjury"]);
    }
    if(checkValidity("byAssistance","bar-assistance")){
        updateBarChart("bar-assistance", 'Amount of submissions that used a specific assistance', '<b>%name</b> was used <b>%yValue</b> amount of times', calculatedValues["byAssistance"]);
    }
    if(checkValidity("byNumberTraining","bar-training")){
        updateBarChart("bar-training", 'Amount of submissions by number of trainings', '<b>%yValue</b> submitters had <br> a training <b>%name</b> times', calculatedValues["byNumberTraining"]);
    }

    if(checkValidity("byGender","donut-gender")){
        updateDonutChart("donut-gender",'Submissions by gender', '<b>%yValue</b> submissions by <b>%name</b>', calculatedValues["byGender"]);
    }
    // if(checkValidity("byCorrectSolution","bar-corr_sol")){
    //     updateBarChart("bar-corr_sol",'Submissions by correct solution provided',
    //         '<b>%yValue</b> submissions were <br>of type <b>%name</b>', calculatedValues["byCorrectSolution"]);
    // }
    if(checkValidity("byHospitalization","bar-hosp_req")){
        updateBarChart("bar-hosp_req",'Submissions by hospitalization required',
            '<b>%yValue</b> cases were <br><b>%name</b>', calculatedValues["byHospitalization"]);
    }
    if(checkValidity("byBlended","bar-blended")){
        updateBarChart("bar-blended",'Amount of submissions that had blended training',
            '<b>%yValue</b> cases were <b>%name</b>', calculatedValues["byBlended"]);
    }
    if(checkValidity("byProfHelp","bar-prof-help")){
        updateBarChart("bar-prof-help",'Amount of submissions that required professional help',
            '<b>%yValue</b> cases were <b>%name</b>', calculatedValues["byProfHelp"]);
    }

    // Optional alternative for a bar chart -- CURRENTLY NOT USED
    // if(checkValidity("byCorrectSolution", "text-corr_sol")){
    //     document.getElementById("text-corr_sol").innerHTML = createHTMLCorrectSolution();
    // }

    updateMap();
}

// Check if the desired chart is a valid one, draw it if it's true, hide the elements if it is false.
function checkValidity(id, element){
    if (isNotEmpty(id)){
        document.getElementById(element).style.display = 'block';
        return true;
    }
    else{
        document.getElementById(element).style.display = 'none';
        return false;
    }
}

// Check if the given array exists and is not empty
function isNotEmpty(id){
    if (calculatedValues[id] != null){
        if (calculatedValues[id].length !== 0){
           return true;
        }
    }
    return false;
}

// Makes string for submissions by correct solution provided -- Optional alternative for a bar chart -- CURRENTLY NOT USED
// function createHTMLCorrectSolution() {
//     let text = "";
//     for (let i = 0; i < calculatedValues["byCorrectSolution"].length; i ++){
//         text += "<b>" + calculatedValues["byCorrectSolution"][i].y + "</b> submitters provided a " + "<b>"+ calculatedValues["byCorrectSolution"][i].name +"</b> solution. </br></br>";
//     }
//     return text;
// }

// Update the given bar chart
function updateBarChart(elementId, title, tooltip, points){
    let pixelCount = 400;
    for (let i=0; i<Math.floor(points.length/10); i++){
        pixelCount += 400;
        document.getElementById(elementId).parentNode.style.height = pixelCount + 'px';
    }
    var chart = JSC.chart(elementId, {
        debug: true,
        type: 'horizontal column',
        title: {
            label: {text: title,style_fontSize: 16 },
            position: 'center'
        },
        legend_visible: false,
        yAxis_defaultTick_label_text: '%value',
        yAxis_formatString:'n',
        xAxis: {
            defaultTick: {
                placement: 'inside',
                label: {
                    color: 'white',
                    style: {
                        fontWeight: 'bold',
                        fontSize: 16
                    }
                }
            }
        },
        series: [
            {
                defaultPoint: {
                    tooltip: tooltip,
                    label_text: '%value'
                },
                name: title,
                points: points
            }
        ]
    }, function(c) {
        c.series()
            .points()
            .options({ color: '#940606' });
    } );
}

// Update the given donut chart
function updateDonutChart(elementId, title, tooltip, points){
    let count = 0;
    let chart = JSC.chart(elementId, {
        debug: true,
        legend: {
            template: '%icon %name',
            position: 'right'
        },
        title: {
            label: {text: title,style_fontSize: 16 },
            position: 'center'
        },
        defaultSeries: { type: 'pie donut'},
        defaultAnnotation_label_style_fontSize: 16,
        series: [
            {
                defaultPoint: {
                    tooltip: tooltip,
                    marker: {
                        visible: false
                    },
                    label_text: '%value'
                },
                name: title,
                points: points,
            }
        ],
        toolbar_visible: false}, function(c) {
        c.series()
            .points(function(p) {
                count++;
                let step = Math.round(160/points.length);
                let bValue = 200-step*count;
                p.options({color: 'rgb(' + bValue + ',6,6)'});
            })
    } );
}

// Updates the heatmap
function updateMap(){
    let filteredValues = calculatedValues["byMap"]["coordinates"].filter(function (el) {
        return !(el["latitude"] === 0 && el["longitude"] === 0);
    });

    let newArray = [];
    for(let i=0;i<filteredValues.length;i++)
    {
        newArray.push(new google.maps.LatLng(filteredValues[i]["latitude"], filteredValues[i]["longitude"]));
    }

    let mapOptions = { zoom:3, mapTypeId: google.maps.MapTypeId.ROADMAP, center: {lat: calculatedValues["byMap"]["centerLatitude"], lng: calculatedValues["byMap"]["centerLongitude"]} };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    for (let i = 0; i < calculatedValues["byMap"]["coordinates"].length; i ++){
        let customTxt = "<div>" + calculatedValues["byMap"]["coordinates"][i]["latitude"] + ", " +  calculatedValues["byMap"]["coordinates"][i]["longitude"] + "</div>";
        let txt = new TxtOverlay(new google.maps.LatLng( calculatedValues["byMap"]["coordinates"][i]["latitude"],
            calculatedValues["byMap"]["coordinates"][i]["longitude"]), customTxt, "customBox", map);
        txt.hide();
        overlays.push(txt);
    }

    map.addListener('zoom_changed', function() {
        if (map.zoom > 8){
            for (let i = 0; i < overlays.length; i ++){
                overlays[i].show();
            }
        }
        else{
            for (let i = 0; i < overlays.length; i ++){
                overlays[i].hide();
            }
        }
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: newArray,
        map: map
    });

    directionsDisplay.setMap(map);
}

function TxtOverlay(pos, txt, cls, map) {
    this.pos = pos;
    this.txt_ = txt;
    this.cls_ = cls;
    this.map_ = map;

    this.div_ = null;

    this.setMap(map);
}

TxtOverlay.prototype.onAdd = function() {
    // Create the DIV and set some basic attributes.
    var div = document.createElement('DIV');
    div.className = this.cls_;

    div.innerHTML = this.txt_;

    // Set the overlay's div_ property to this DIV
    this.div_ = div;
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.pos);
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    // We add an overlay to a map via one of the map's panes.

    var panes = this.getPanes();
    panes.floatPane.appendChild(div);
}

TxtOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection();

    var position = overlayProjection.fromLatLngToDivPixel(this.pos);

    var div = this.div_;
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
}

//Optional: helper methods for removing and toggling the text overlay.
TxtOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
}

TxtOverlay.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
}

TxtOverlay.prototype.show = function() {
    if (this.div_) {
        this.div_.style.visibility = "visible";
    }
}

TxtOverlay.prototype.toggle = function() {
    if (this.div_) {
        if (this.div_.style.visibility == "hidden") {
            this.show();
        } else {
            this.hide();
        }
    }
}

TxtOverlay.prototype.toggleDOM = function() {
    if (this.getMap()) {
        this.setMap(null);
    } else {
        this.setMap(this.map_);
    }
}
