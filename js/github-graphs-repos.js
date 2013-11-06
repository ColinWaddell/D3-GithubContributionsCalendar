function gitFancyRepos(target, settings){
  var properties = 
  {
    _graphData: [],
    _target : [],
  };

  var plugin = {



    /*************************************
     * Public plugin settings and methods
     ************************************/

    // settings for the plugin
    settings: {
      username: 'ColinWaddell',
      xaxis_title: '',
      yaxis_title: 'Number of Commits'
    },

    // constructor function
    init: function(){
      this._target.innerHTML = "";
      this._target.classList.add("git-graph");
      this._buildGraph();
      this._pullUserData();      
    },




    /*************************************
     * Private methods for d3 graph
     ************************************/

    // take repo activity data and format for d3
    _buildGraphData: function(repo){
      var owner_values = [],
          d = new Date(),
          i = 0;

      d.setDate(d.getDate() - 7*52);

      for (i=0; i<52; i++){
        owner_values.push([d.valueOf(), repo.contents.owner[i]]);
        d.setDate(d.getDate() + 7);
      }

      return owner_values;
    },

    // d3 handler for creating the graph template
    _buildGraph: function(){
      var colors = d3.scale.category20();
      keyColor = function(d, i) {return colors(d.key);};
      this._graphData = [];

      this._target.innerHTML = "<svg></svg>";
      var id = "#" + this._target.id + " svg";

      nv.addGraph(function() {
        this._chart = nv.models.stackedAreaChart()
                      .showControls(false)
                      .x(function(d) { return d[0];})
                      .y(function(d) { return d[1];})
                      .transitionDuration(0)
                      .color(keyColor);

        if(this.settings.xaxis_title!==''){
          this._chart.options({margin:{bottom: 100}})
                     .showXAxis(true);
        }

        if(this.settings.yaxis_title!==''){
          this._chart.options({margin:{left: 100}, noData: "Loading Data From Github"})
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

    // add data to the graph
    _addGraphData: function(name, data){
      if (typeof(this._graphData)==="object"){
        this._graphData.push( { "key" : name, "values" : data} );

        d3.select("#" + this._target.id + " svg")
          .datum(this._graphData)
          .transition()
          .duration(0)
          .call(this._chart);
      }
    },

    // show a particular message in place of blank graph
    _showMessage: function(message){
        this._chart.options({noData: message || "Error Loading Data From Github"});
        d3.select("#" + this._target.id + " svg")
          .call(this._chart);
    },




    /*************************************
     * private AJAX methods and handlers
     *************************************/

    // grab json user data
    _pullUserData: function(){
      this._pullData('https://api.github.com/users/'+this.settings.username+'/repos',
                      this._handleUserData, "Error Loading User Data");
    },

    // handler for successful user-data GET
    _handleUserData: function(repos) {
      if (typeof(repos)==="object"){
        this._showMessage("Loading Activity Data");

        var index;
        for (index=0; index<repos.length; index++){
          if (repos[index].name !== (this.settings.username.toLowerCase()+'.github.com')) {
            this._pullActivityData(repos[index]);
          }
        }

      }
      else{
        this._showMessage("Data for user " + this.settings.username + " is not available");
      }
    },

    // grab activity data from repo
    _pullActivityData: function(repo){
      var proxy = 'http://cdn.bitpshr.net/simple-proxy/simple-proxy.php?url=',
          url = 'https://github.com/'+this.settings.username+'/'+repo.name+'/graphs/owner_participation';

      this._pullData(proxy+url, this._handleActivityData.bind(this, repo.name), "Error Loading Activity Data");
    },

    // handler for successful activity GET
    _handleActivityData: function(name, repo){
      this._addGraphData(name, this._buildGraphData(repo));
    },




    /*************************************
     * jquery replacement methods
     *************************************/

    // replacement for $.extend
    _extend: function(destination, source) {
      var property;
      for (property in source) {
        if (source.hasOwnProperty(property)){
          if(source[property] && source[property].constructor && source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            this._extend(destination[property], source[property]);
          }
          else {
            destination[property] = source[property];
          }
        }
      }
      return destination;
    },

    // replacement for $.ajax
    _pullData: function(url, success, errorMessage){
      var xhr = new XMLHttpRequest();
      var that = this;

      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4){
          if (typeof(xhr.response) !== "undefined") {
            success.call(that, JSON.parse(xhr.response));
          }
          else{
            that._showMessage(errorMessage);
          }
        }

      };
      xhr.send();         
    }

  };

  plugin._extend(this, plugin, properties);
  plugin._extend(this.settings, settings);
  this._target = document.getElementById(target);
  this.init();
}

