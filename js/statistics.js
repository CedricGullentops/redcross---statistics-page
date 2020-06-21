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

// Things to do when a filter value is updated
// TODO: when a filters value changes, check which charts are still valid to show

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
    // Make this element invisible, acts like a second tab instead
    document.getElementById('dataWrapper').style.display = 'none';

    // Initialize settings by getting back-end information
    getAssistances();
    getInjuries();
    getCountries();

    // Get all datapoints based on current filter settings
    getCalculatedValues();
    getRawData();

    // Initialize all graphs
    updateGraphs();

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

// Change elements when changing tabs (make it look like there are 2 pages)
function pressedStatisticsTab(){
    document.getElementById("statisticsTab").className = "nav-item active";
    document.getElementById("dataTab").className = "nav-item";

    document.getElementById('swappableContent').style.display = 'block';
    document.getElementById('mapWrapper').style.display = 'block';
    document.getElementById('dataWrapper').style.display = 'none';
}

// Change elements when changing tabs
function pressedDataTab(){
    document.getElementById("dataTab").className = "nav-item active";
    document.getElementById("statisticsTab").className = "nav-item";

    document.getElementById('swappableContent').style.display = 'none';
    document.getElementById('mapWrapper').style.display = 'none';
    document.getElementById('dataWrapper').style.display = 'block';
}

// update all graphs based on currentValues
function updateGraphs(){
    updateBarAge();
    updateBarEducation();
    updateDonutCorrectSolution();
    updateDonutHospitalization();
    updateDonutGender();
    //TODO: by number of training bar/donut?
    updateBarInjury();
    updateDonutTraining();
    updateDonutBlended();
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

// Barchart by age
function updateBarAge() {
    var chart = JSC.chart('bar-age', {
        debug: true,
        type: 'column',
        title_label_text:
            'Amount of submissions by age',
        legend_visible: false,
        yAxis_defaultTick_label_text: '%value',
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
                        '<b>%yValue</b> people that submitted are <br>in the age range of <b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Submissions by age',
                points: [
                    {
                        name: '<15',
                        y: 50
                    },
                    {
                        name: '15-25',
                        y: 80
                    },
                    {
                        name: '35-45',
                        y: 65
                    },
                    {
                        name: '45-55',
                        y: 24
                    },
                    {
                        name: '55-65',
                        y: 11
                    },
                    {
                        name: '65-75',
                        y: 6
                    },
                    {
                        name: '75-85',
                        y: 3
                    },
                    {
                        name: '>85',
                        y: 1
                    }
                ]
            }
        ]
    });
}

// Barchart by education
function updateBarEducation(){
    var chart = JSC.chart('bar-edu', {
        debug: true,
        type: 'column',
        title_label_text:
            'Amount of submissions by education',
        legend_visible: false,
        yAxis_defaultTick_label_text: '%value',
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
                        '<b>%yValue</b> people that submitted have <br><b>%name</b> as their highest form of education',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Submissions by education',
                points: [
                    {
                        name: 'No education',
                        y: 60
                    },
                    {
                        name: 'Primary school',
                        y: 120
                    },
                    {
                        name: 'High school',
                        y: 90
                    },
                    {
                        name: 'Bachelor\'s degree',
                        y: 30
                    },
                    {
                        name: 'Master\'s degree',
                        y: 12
                    },
                    {
                        name: 'Phd',
                        y: 3
                    }
                ]
            }
        ]
    });
}

// Donut by correct solution
function updateDonutCorrectSolution(){
    var chart = JSC.chart('donut-corr_sol', {
        debug: true,
        legend: {
            template: '%icon %name',
            position: 'inside center'
        },
        title: {
            label: {text: 'Submissions by correct solution provided',style_fontSize: 16 },
            position: 'center'
        },
        defaultSeries: { type: 'pie donut', palette: 'fiveColor36'  },
        defaultAnnotation_label_style_fontSize: 16,
        series: [
            {
                defaultPoint: {
                    tooltip:
                        '<b>%yValue</b> submissions were <br>of type <b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Submissions by correct solution provided',
                points: [
                    {
                        name: 'Correct solution',
                        y: 90
                    },
                    {
                        name: 'Uncorrect solution',
                        y: 10
                    }
                ]
            }
        ],
        toolbar_visible: false});
}

// Donut by required hospitalization
function updateDonutHospitalization(){
    var chart = JSC.chart('donut-hosp_req', {
        debug: true,
        legend: {
            template: '%icon %name',
            position: 'inside center'
        },
        title: {
            label: {text: 'Submissions by hospitalization required',style_fontSize: 16 },
            position: 'center'
        },
        defaultSeries: { type: 'pie donut', palette: 'fiveColor36'  },
        defaultAnnotation_label_style_fontSize: 16,
        series: [
            {
                defaultPoint: {
                    tooltip:
                        '<b>%yValue</b> cases of <br><b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Submissions by hospitalization required',
                points: [
                    {
                        name: 'Hospitalization required',
                        y: 30
                    },
                    {
                        name: 'Not required',
                        y: 70
                    }
                ]
            }
        ],
        toolbar_visible: false});
}

// Donut by gender
function updateDonutGender(){
    var chart = JSC.chart('donut-gender', {
        debug: true,
        legend: {
            template: '%icon %name',
            position: 'inside center'
        },
        title: {
            label: {text: 'Submissions by gender',style_fontSize: 16 },
            position: 'center'
        },
        defaultSeries: { type: 'pie donut', palette: 'fiveColor36'  },
        defaultAnnotation_label_style_fontSize: 16,
        series: [
            {
                defaultPoint: {
                    tooltip:
                        '<b>%yValue</b> submissions by <b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Submissions by gender',
                points: [
                    {
                        name: 'M',
                        y: 45
                    },
                    {
                        name: 'F',
                        y: 55
                    },
                    {
                        name: 'X',
                        y: 2
                    }
                ]
            }
        ],
        toolbar_visible: false});
}

// Barchart by injury type
function updateBarInjury() {
    var chart = JSC.chart('bar-injury', {
        debug: true,
        type: 'column',
        title_label_text:
            'Amount of submissions of a specific injury type',
        legend_visible: false,
        yAxis_defaultTick_label_text: '%value',
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
                        '<b>%yValue</b> injuries where <br>of type <b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Amount of submissions of a specific injury type',
                points: [
                    {
                        name: 'Fracture',
                        y: 10
                    },
                    {
                        name: 'Snake bites',
                        y: 99
                    }
                ]
            }
        ]
    });
}

// Barchart by assistance type
function updateBarAssistance() {
    var chart = JSC.chart('bar-assistance', {
        debug: true,
        type: 'column',
        title_label_text:
            'Amount of submissions that used a specific assistance',
        legend_visible: false,
        yAxis_defaultTick_label_text: '%value',
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
                        '<b>%yValue</b> cases used <b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Amount of submissions that used a specific assistance',
                points: [
                    {
                        name: 'AreaSafe',
                        y: 40
                    },
                    {
                        name: 'SupportVictim',
                        y: 10
                    }
                ]
            }
        ]
    });
}

// Donut by training
function updateDonutTraining(){
    var chart = JSC.chart('donut-training', {
        debug: true,
        legend: {
            template: '%icon %name',
            position: 'inside center'
        },
        title: {
            label: {text: 'Submissions by training type',style_fontSize: 16 },
            position: 'center'
        },
        defaultSeries: { type: 'pie donut', palette: 'fiveColor36'  },
        defaultAnnotation_label_style_fontSize: 16,
        series: [
            {
                defaultPoint: {
                    tooltip:
                        '<b>%yValue</b> submissions had <br><b>%name</b> training',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Submissions by training type',
                points: [
                    {
                        name: 'Red cross',
                        y: 95
                    },
                    {
                        name: 'Other',
                        y: 5
                    }
                ]
            }
        ],
        toolbar_visible: false});
}

// Donut by blended
function updateDonutBlended(){
    var chart = JSC.chart('donut-blended', {
        debug: true,
        legend: {
            template: '%icon %name',
            position: 'inside center'
        },
        title: {
            label: {text: 'Amount of submissions that had blended training',style_fontSize: 16 },
            position: 'center'
        },
        defaultSeries: { type: 'pie donut', palette: 'fiveColor36'  },
        defaultAnnotation_label_style_fontSize: 16,
        series: [
            {
                defaultPoint: {
                    tooltip:
                        '<b>%yValue</b> submissions were <b>%name</b>',
                    marker: {
                        visible: true,
                        size: 40,
                        fill: 'azure'
                    },
                    label_text: '%value'
                },
                name: 'Amount of submissions that had blended training',
                points: [
                    {
                        name: 'Blended',
                        y: 45
                    },
                    {
                        name: 'Not blended',
                        y: 50
                    },
                    {
                        name: 'Other',
                        y: 10
                    }
                ]
            }
        ],
        toolbar_visible: false});
}