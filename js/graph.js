var pieData = {
    "header": {
        "title": {
            "text": "Title",
            "fontSize": 24,
            "font": "Arial"
        },
        "subtitle": {
            "text": "Subtitle",
            "color": "#999999",
            "fontSize": 12,
            "font": "Arial"
        },
        "titleSubtitlePadding": 9
    },
    "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
    },
    "size": {
        "canvasWidth": 590,
        "pieOuterRadius": "85%"
    },
    "data": {
        "sortOrder": "value-asc",
        "content": [
            {
                "label": "Test1",
                "value": 123,
                "color": "#e65414"
            },
            {
                "label": "Test2",
                "value": 456,
                "color": "#8b6834"
            },
            {
                "label": "Test3",
                "value": 789,
                "color": "#248838"
            }
        ]
    },
    "labels": {
        "outer": {
            "pieDistance": 32
        },
        "inner": {
            "hideWhenLessThanPercentage": 3
        },
        "mainLabel": {
            "fontSize": 11
        },
        "percentage": {
            "color": "#ffffff",
            "decimalPlaces": 0
        },
        "value": {
            "color": "#adadad",
            "fontSize": 11
        },
        "lines": {
            "enabled": true
        },
        "truncation": {
            "enabled": true
        }
    },
    "effects": {
        "load": {
            "effect": "none"
        },
        "pullOutSegmentOnClick": {
            "effect": "linear",
            "speed": 400,
            "size": 8
        },
        "highlightSegmentOnMouseover": false
    },
    "misc": {
        "gradient": {
            "enabled": true,
            "percentage": 100
        }
    }
};
var pie = new d3pie("pieChart", pieData);

function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$.ajaxSetup({
    headers: {
        'Authorization': 'token 482bcf5b7604374578cfff6c0d5f0f6ead55e5cd'
    }
});

var languagesMap = {};

function go() {
    var username = $('#username').val();

    var length;
    var count = 0;

    // get all data about the user
    $.getJSON('https://api.github.com/users/' + username + '/repos', function (data) {
        // iterate through that data
        length = data.length;

        data.forEach(function (obj) {
            // get languages for an individual repository
            $.getJSON(obj.languages_url, function (languages) {
                // iterate through an individual repository's languages and add them to the final map
                Object.keys(languages).forEach(function (key) {
                    if (!languagesMap.hasOwnProperty(key)) {
                        languagesMap[key] = languages[key];
                    } else {
                        languagesMap[key] += languages[key];
                    }
                });

                count++;
            });
        });
    });

    var checkForCompletion = setInterval(function () {
        if (count === length) {
            clearInterval(checkForCompletion);
            afterCompletion();
        }
    }, 50);
}

function afterCompletion() {
    var content = [];

    Object.keys(languagesMap).forEach(function (key) {
        content.push({
            "label": key,
            "value": languagesMap[key],
            "color": randomColor()
        });
    });

    pieData.data.content = content;

    console.log(pieData);

    pie.destroy();
    pie = new d3pie("pieChart", pieData);
}