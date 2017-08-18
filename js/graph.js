function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var pieData = {
    "header": {
        "title": {
            "text": "Programming Languages",
            "fontSize": 24,
            "font": "Arial"
        },
        "subtitle": {
            "text": "Bytes of code written in each language",
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
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 2.5,
            "label": "Other"
        },
        "content": [
            {
                "label": "Pie Chart",
                "value": 1,
                "color": randomColor()
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
            "effect": "default",
            "speed": 400
        },
        "pullOutSegmentOnClick": {
            "effect": "linear",
            "speed": 400,
            "size": 16
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

$.ajaxSetup({
    headers: {
        "Authorization": "token 482bcf5b7604374578cfff6c0d5f0f6ead55e5cd"
    }
});

var languagesMap = {};
var username;

function go() {
    $("#invalidUsername").hide();

     languagesMap = {};
     username = $('#username').val();

    var length;
    var count = 0;

    var updateCompletion;

    // get all data about the user
    $.getJSON("https://api.github.com/users/" + username + "/repos", function (data) {
        // iterate through that data
        length = data.length;

        if (length === 0) {
            // invalid username
            $("#invalidUsername").show();
            clearInterval(updateCompletion);
            return;
        }

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
    }).fail(function() {
        // invalid username
        $("#invalidUsername").show();
        clearInterval(updateCompletion);
    });

    updateCompletion = setInterval(function () {
        if (length === 0 || length === null) {
            return;
        }

        var loadCompletion = 100 * count / length;
        $("#progress").attr("value", loadCompletion.toString());

        if (count === length) {
            clearInterval(updateCompletion);
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

    var concat = "'s Programming Languages";
    if (username.endsWith("s")) {
        concat = "' Programming Languages"
    }

    pieData.data.content = content;
    pieData.header.title.text = username + concat;

    pie.destroy();
    pie = new d3pie("pieChart", pieData);
}