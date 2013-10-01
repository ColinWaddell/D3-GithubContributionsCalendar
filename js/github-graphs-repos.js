// Build some example graphs
var graph = new Gitgraph({ 
        user    : 'nex3',
        repo    : 'sass',
        domNode : document.getElementById("graphDiv"),
        width   : 800,
        height  : 170,
        allColor: "rgb(202, 202, 202)",
        userColor: "rgb(51, 102, 153)",
        background: "white"
});
graph.className += "graph";

var graph2 = new Gitgraph({ 
        user    : 'josephg',
        repo    : 'sharejs',
        domNode : document.getElementById("graphDiv2"),
        width   : 800,
        height  : 50,
        allColor: "#DE0052",
        userColor: "#4C10AE",
        background: "#AAA"
});
graph2.className += "graph";

var graph3 = new Gitgraph({ 
        user    : 'imathis',
        repo    : 'octopress',
        domNode : document.getElementById("graphDiv3"),
        width   : 800,
        height  : 100,
        allColor: "#FFD073",
        userColor: "#FF4040",
        background: "#5CCCCC"
});
graph3.className += "graph";

var graph4 = new Gitgraph({ 
        user    : 'nex3',
        repo    : 'sass',
        domNode : document.getElementById("graphDiv4"),
        width   : 800,
        height  : 70,
        allColor: "#025167",
        userColor: "#86B32D",
        background: "#FF7D73"
});
graph4.className += "graph";


// Guages tracking
var _gauges = _gauges || [];
(function() {
        var t   = document.createElement('script');
        t.type  = 'text/javascript';
        t.async = true;
        t.id    = 'gauges-tracker';
        t.setAttribute('data-site-id', '50b93314f5a1f55a5800000c');
        t.src = '//secure.gaug.es/track.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(t, s);
}());

