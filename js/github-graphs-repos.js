function gitFancyRepos(target, settings){
  var properties = 
  {
    _graphData: [],
    _target : [],
  };

  var plugin = {

    settings: {
      username: 'ColinWaddell',
      xaxis_title: '',
      yaxis_title: 'Number of Commits'
    },


    init: function(){
      this._target.empty();
      this._target.addClass("git-graph");
      this._buildGraph();
      this._pullUserData();      
    },

    _sortByName: function(repos) {
        repos.sort(function(a,b) {
          return a.name - b.name;
       });
    },

    _buildGraphData: function(repo){
  
      //var other_values = [];
      var owner_values = [],
          d = new Date(),
          i = 0;

      d.setDate(d.getDate() - 7*52);

      for (i=0; i<52; i++){
        //other_values.push([d.valueOf(), repo.activity.all[i]]);
        owner_values.push([d.valueOf(), repo.activity.contents.owner[i]]);
        d.setDate(d.getDate() + 7);
      }

      return owner_values;
    },

    _buildGraph: function(){
      var colors = d3.scale.category20();
      keyColor = function(d, i) {return colors(d.key);};
      this._graphData = [];

      this._target.empty().append("<svg></svg>");
      var id = "#" + this._target.get(0).id + " svg";

      nv.addGraph(function() {
        this._chart = nv.models.stackedAreaChart()
                      .showControls(false)
                      .x(function(d) { return d[0];})
                      .y(function(d) { return d[1];})
                      .transitionDuration(300)
                      .color(keyColor);
                      //.clipEdge(true);


        if(this.settings.xaxis_title!==''){
          this._chart.options({margin:{bottom: 100}})
                     .showXAxis(true);
        }

        if(this.settings.yaxis_title!==''){
          this._chart.options({margin:{left: 100}})
                     .showYAxis(true);
        }

        this._chart.xAxis.axisLabel(this.settings.xaxis_title)
                         .tickFormat(function(d) { return d3.time.format('%x')(new Date(d));});

        this._chart.yAxis.axisLabel(this.settings.yaxis_title)
                         .tickFormat(d3.format(',.2f'));

        d3.select(id)
          .datum(this._graphData)
          .call(this._chart);

        nv.utils.windowResize(this._chart.update);
        return this._chart;
      }.bind(this));
              
    },

    _addGraphData: function(name, data){
      if (typeof(this._graphData)==="object"){
        this._graphData.push( { "key" : name, "values" : data} );

        d3.select("#" + this._target.get(0).id + " svg")
          .datum(this._graphData)
          .transition()
          .duration(500)
          .call(this._chart);
      }
    },

    _pullActivityData: function(repo){
      var proxy = 'http://cdn.bitpshr.net/simple-proxy/simple-proxy.php?url=',
          url = 'https://github.com/'+this.settings.username+'/'+repo.name+'/graphs/owner_participation';

      $.getJSON(proxy+url, this._handleActivityData.bind(this, repo));
    },

    _pullUserData: function(){
      $.getJSON('https://api.github.com/users/'+this.settings.username+'/repos?callback=?', 
        this._handleUserData.bind(this));
    },

    _handleUserData: function(data) {
      var repos = data.data; // JSON Parsing
      this._sortByName(repos);    
   
      $(repos).each(function(index, value) {
        if (value.name !== (this.settings.username.toLowerCase()+'.github.com')) {
          this._pullActivityData(value);
        }
      }.bind(this)); 
    },

    _handleActivityData: function(repo, activity){
      repo.activity = activity;
      this._addGraphData(repo.name, this._buildGraphData(repo));
    },
      
  };

  $.extend(this, plugin, properties);
  $.extend(this.settings, settings);
  this._target = $(target);
  this.init();
}

var g = new gitFancyRepos('#my-github-projects');
