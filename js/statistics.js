window.initAll()

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
}

function initAll(){
    var client = new HttpClient();
    getAssistances(client);

    // initBarAge();
    // initMap();
    // initBarChartGender();
    // initDonutChartAge();
    // initDonutChartEducation();
    // initDonutChartSolution();
    // initDonutChartHospitalization();
}

// Get list of assistances
function getAssistances(client){
    document.write("In here");
    client.get('http://some/thing?with=arguments', function(response) {
        var result = JSON.parse(response);
        document.write(result);
    });
}

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

function setCountry(){
    let element = document.getElementById("settingCountry");
    settings.location = element.options[element.selectedIndex].value;
}

//class for settings
var settings = {
    location: "Africa",
    injury: "All",
    gender: "All",
    age: "All",
    education: "All"
};

// Heatmap
var map, heatmap;

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