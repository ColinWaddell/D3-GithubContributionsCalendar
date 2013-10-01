
// Build some example graphs



function gitFancyRepos(settings){
  var plugin = {

    settings: {
      username: 'ColinWaddell',
      target: '#my-github-projects'
    },

    init: function(){
      this._loadUserData();      
      this.target = $(this.settings.target);
      this.target.html("<span>Querying GitHub for " + this.settings.username +"'s repositories...</span>");
    },

    _loadUserData: function(){          
      $.getJSON('https://api.github.com/users/'+this.settings.username+'/repos?callback=?', this._handleUserData.bind(this));
    },

    _sortByName: function(repos) {
        repos.sort(function(a,b) {
          return a.name - b.name;
       });
    },

    _handleUserData: function(data) {
      var repos = data.data; // JSON Parsing
      this._sortByName(repos);    
   
      this.target.empty();

      $(repos).each(function(index, value) {
        if (value.name !== (this.settings.username.toLowerCase()+'.github.com')) {
          /*list.append('<dt><a href="'+ */
            //(value.homepage?value.homepage:value.html_url) +'">' + 
            //value.name + '</a> <em>'+(value.language?('('+value.language+')'):'')+'</em></dt>');
          /*list.append('<dd>' + value.description +'</dd>');*/

          var id = 'gitgraph'+index;
          this.target.append("<div id='"+id+"'></div>");
          var graph = new Gitgraph({ 
            user    : this.settings.username,
            repo    : value.name,
            domNode : document.getElementById(id),
            width   : 800,
            height  : 170,
            allColor: "rgb(202, 202, 202)",
            userColor: "rgb(51, 102, 153)",
            background: "white"
          });

        }
      }.bind(this)); 
    },
      
  };

  $.extend(this, plugin);
  $.extend(this.settings, settings);
  this.init();
}

var g = new gitFancyRepos();
