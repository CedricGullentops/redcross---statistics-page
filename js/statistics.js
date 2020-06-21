// HttpClient for get requests
let HttpClient = function() {
    this.get = function(aUrl, aCallback, body=null) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        };
        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( body );
    }
};
let client = new HttpClient();

// Settings values from back-end
class Settings {
    constructor() {
        this._countries = [];
        this._injuries = [];
        this._assistances = [];
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
    to: ""
    // TODO: add education: "All"
};

function setTypeOfFA(){
    // TODO: add this one
}

function setCountry(){
    let element = document.getElementById("settingCountry");
    currentSettings.country = element.options[element.selectedIndex].value;
    getCalculatedValues();
    getRawData();
}
function setAge(){
    let element = document.getElementById("settingAge");
    currentSettings.age = element.options[element.selectedIndex].value;
    getCalculatedValues();
    getRawData();
}
function setGender(){
    let element = document.getElementById("settingGender");
    currentSettings.gender = element.options[element.selectedIndex].value;
    getCalculatedValues();
    getRawData();
}
function setAssistances(){
    let element = document.getElementById("settingAssistances");
    currentSettings.assistance = element.options[element.selectedIndex].value;
    getCalculatedValues();
    getRawData();
}
function setInjuries(){
    let element = document.getElementById("settingInjuries");
    currentSettings.injury = element.options[element.selectedIndex].value;
    getCalculatedValues();
    getRawData();
}
function setEducation(){
    let element = document.getElementById("settingEducation");
    currentSettings.education = element.options[element.selectedIndex].value;
    getCalculatedValues();
    getRawData();
}

// The values calculated by the back-end
let calculatedValues;
let rawValues;

// Heatmap
let map, heatmap;

window.initAll();

function initAll(){
    // Initialize settings by getting back-end information
    getAssistances();
    getInjuries();
    getCountries();

    // Get all datapoints based on current filter settings
    getCalculatedValues();
    getRawData();


    initBarAge();

    initBarChartGender();
    initDonutChartAge();
    initDonutChartEducation();
    initDonutChartSolution();
    initDonutChartHospitalization();

    initMap();
}

// Get list of assistances
function downloadFile(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/export', function(response) {console.log(response)},
        JSON.stringify(currentSettings));
}

// Get raw data
function getRawData(){
    let elementExists = document.getElementById("mytable");
    if (elementExists != null){
        elementExists.remove();
    }
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/raw', function(response) {
            rawValues = JSON.parse(response);
            let tbl=$("<table/>").attr("id","mytable");
            $("#dataWrapper").append(tbl);

            let tr="<tr>";
            let td1="<th>"+"age"+"</th>";
            let td2="<th>"+"assignDate"+"</th>";
            let td3="<th>"+"assistances"+"</th>";
            let td4="<th>"+"blendedTraining"+"</th>";
            let td5="<th>"+"confidentApplyingFA"+"</th>";
            let td6="<th>"+"country"+"</th>";
            let td7="<th>"+"education"+"</th>";
            let td8="<th>"+"gender"+"</th>";
            let td9="<th>"+"hadFATraining"+"</th>";
            let td10="<th>"+"hospitalisationRequired"+"</th>";
            let td11="<th>"+"id"+"</th>";
            let td12="<th>"+"injuries"+"</th>";
            let td13="<th>"+"latitude"+"</th>";
            let td14="<th>"+"longitude"+"</th>";
            let td15="<th>"+"macAddress"+"</th>";
            let td16="<th>"+"numberOffATtraining"+"</th>";
            let td17="<th>"+"otherTrainingProvider"+"</th>";
            let td18="<th>"+"phNeeded"+"</th>";
            let td19="<th>"+"phTimeToArrive"+"</th>";
            let td20="<th>"+"phTypes"+"</th>";
            let td21="<th>"+"setting"+"</th>";
            let td22="<th>"+"trainingByRC"+"</th>";
            let td23="<th>"+"trainingByRC"+"</th></tr>";

            $("#mytable").append(tr+td1+td2+td3+td4+td5+td6+td7+td8+td9+td10+td11
                +td12+td13+td14+td15+td16+td17+td18+td19+td20+td21+td22+td23);

            for(var i=0;i<rawValues.length;i++)
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
        },
        JSON.stringify(currentSettings));
}

// Get statistics from back-end based on currentSettings
function getCalculatedValues(){
    client.get('https://redcrossbackend.azurewebsites.net/Analytics/stats', function(response) {
            calculatedValues = JSON.parse(response);
            console.log("calculatedValues" + calculatedValues);
        },
        JSON.stringify(currentSettings));
    updateGraphs();
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
        let select = document.getElementById("settingCountries");
        for(let i = 0; i < settings.countries.length; i++){
            let country = settings.countries[i];
            let el = document.createElement("option");
            el.textContent = country;
            el.value = country;
            select.appendChild(el);
        }
    });
}

function pressedStatisticsTab(){
    document.getElementById("statisticsTab").className = "nav-item active";
    document.getElementById("dataTab").className = "nav-item";

    document.getElementById('swappableContent').style.display = 'block';
    document.getElementById('mapWrapper').style.display = 'block';
    document.getElementById('dataWrapper').style.display = 'none';

}

function pressedDataTab(){
    document.getElementById("dataTab").className = "nav-item active";
    document.getElementById("statisticsTab").className = "nav-item";

    document.getElementById('swappableContent').style.display = 'none';
    document.getElementById('mapWrapper').style.display = 'none';
    document.getElementById('dataWrapper').style.display = 'block';
}

function updateGraphs(){
    // TODO: update all graphs based on currentValues
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 4.162709, lng: 19.7901007},
        mapTypeId: 'roadmap'
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map
    });
}

function getPoints() {
    return [
        {location: new google.maps.LatLng(10.045843, -10.134802), weight: 10},
        new google.maps.LatLng(17.075164, -10.3820100),
        new google.maps.LatLng(-8.634638, 23.235982),
        new google.maps.LatLng(-8.721729, 23.225264)
    ];
}

////////////////////////////////////////////
////////////////////////////////////////////




// Getting data from back-end
const userAction = async () => {
    const response = await fetch('https://redcrossbackend.azurewebsites.net/Analytics/assistance.json', {
        method: 'POST',
        body: myBody, // string or object
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson

}


// Barchart by age
function initBarAge() {
    var chart = JSC.chart('bar-age', {
        debug: true,
        type: 'column',
        title_label_text:
            'Device Availability And Personal Use',
        legend_visible: false,
        yAxis_defaultTick_label_text: '%value%',
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
                    tooltip:
                        '<b>%yValue%</b> of users have<br>access to <b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value%'
                },
                name: 'Users with access',
                points: [
                    {
                        name: 'Smartphone',
                        y: 78,
                        marker_type:
                            'material/hardware/smartphone'
                    },
                    {
                        name: 'Tablet',
                        y: 39,
                        marker_type: 'material/hardware/tablet'
                    },
                    {
                        name: 'Laptop',
                        y: 49,
                        marker_type: 'material/hardware/laptop'
                    },
                    {
                        name: 'Desktop',
                        y: 61,
                        marker_type:
                            'material/hardware/desktop-windows'
                    }
                ]
            }
        ]
    });
}


// Bar chart by gender
function initBarChartGender() {
    var chart = anychart.column();
    chart.animation(true);
    chart.title('Amount of submissions by gender');

    var series = chart.column([
        ['Male', '147'],
        ['Female', '151'],
        ['X', '10']
    ]);

    series.tooltip().titleFormat('{%X}');

    series
        .tooltip()
        .position('center-top')
        .anchor('center-bottom')
        .offsetX(0)
        .offsetY(5)
        .format('{%Value}');


    chart.yScale().minimum(0);
    chart.yAxis().labels().format('{%Value}');

    chart.tooltip().positionMode('point');
    chart.interactivity().hoverMode('by-x');

    chart.xAxis().title('Gender');
    chart.yAxis().title('# People');

    chart.container('barchartGender');

    chart.draw();
};

// Donut chart by age
function initDonutChartAge() {
    var chart = anychart.pie([
        ['<15', 64],
        ['15-20', 93],
        ['25-30', 25]
    ]);

    chart
        .title('Submissions by age')
        .radius('100%')
        .innerRadius('30%');

    chart.container('donutchartAge');
    chart.draw();
};

// Donut chart by education
function initDonutChartEducation() {
    var chart = anychart.pie([
        ['Uneducated', 93],
        ['Primary School', 25],
        ['High School', 50],
        ['Bachelor\'s degree', 16],
        ['Master\'s degree', 40],
        ['Doctorate', 13]
    ]);

    chart
        .title('Submissions by education')
        .radius('100%')
        .innerRadius('30%');

    chart.container('donutchartEducation');
    chart.draw();
};

// Donut chart by correct solution amount
function initDonutChartSolution() {
    var chart = anychart.pie([
        ['Correct', 90],
        ['Wrong', 10]
    ]);

    chart
        .title('Submissions by amount of correct solutions')
        .radius('100%')
        .innerRadius('30%');

    chart.container('donutchartSolution');
    chart.draw();
};

// Donut chart by hospitalization required
function initDonutChartHospitalization() {
    var chart = anychart.pie([
        ['Required', 30],
        ['Not required', 70]
    ]);

    chart
        .title('Submissions by amount of hospitalizations required')
        .radius('100%')
        .innerRadius('30%');

    chart.container('donutchartHospitalization');
    chart.draw();
};