var pie = new d3pie(document.getElementById("pieChart"), {
    "header": {
        "title": {
            "text": "Programming Languages",
            "fontSize": 24,
            "font": "Arial"
        },
        "subtitle": {
            "text": "Bytes of Language",
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
        "sortOrder": "label-asc",
        "content": [
            {
                "label": "Test1",
                "value": 100,
                "color": "#2383c1"
            },
            {
                "label": "Test2",
                "value": 200,
                "color": "#64a61f"
            },
            {
                "label": "Test3",
                "value": 400,
                "color": "#7b6788"
            }
        ]
    },
    "labels": {
        "outer": {
            "format": "label-value2",
            "pieDistance": 20
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
        "pullOutSegmentOnClick": {
            "effect": "linear",
            "speed": 400,
            "size": 8
        }
    },
    "misc": {
        "gradient": {
            "enabled": true,
            "percentage": 100
        }
    }
});

function go() {
    var username = $('#username').val();

    $.getJSON('https://api.github.com/users/' + username + '/repos', function(data) {
        data.forEach(function(obj) {
            $.getJSON(obj.languages_url, function(languages) {
                console.log(languages);
            });
        });
    });
}