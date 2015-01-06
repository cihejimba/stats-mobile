angular.module("statracker").run(["$templateCache", function($templateCache) {$templateCache.put("templates/tabs.html","<ion-view><ion-tabs class=tabs-stable><ion-tab title=Rounds icon=ion-flag ui-sref=tab.rounds><ion-nav-view name=rounds></ion-nav-view></ion-tab><ion-tab title=Statistics icon=ion-stats-bars ui-sref=tab.stats><ion-nav-view name=stats></ion-nav-view></ion-tab><ion-tab title=Settings icon=ion-gear-b ui-sref=tab.settings><ion-nav-view name=settings></ion-nav-view></ion-tab></ion-tabs></ion-view>");
$templateCache.put("templates/account/login.html","<ion-view view-title=Login><ion-content><div class=row><div class=col><form ng-submit=doLogin()><div class=list><label class=\"item item-input\"><span class=input-label>Email</span> <input type=email ng-model=login.email></label> <label class=\"item item-input\"><span class=input-label>Password</span> <input type=password ng-model=login.password></label> <label class=item><button class=\"button button-block button-positive\" type=submit>Log in</button></label></div></form></div></div><div class=row ng-show=login.hasError><div class=col><p>{{login.error}}</p></div></div><div class=row><div class=col><p>New to StaTracker?</p></div><div class=col><button class=\"button button-calm\" ui-sref=register>Register</button></div></div></ion-content></ion-view>");
$templateCache.put("templates/account/my-bag.html","<ion-view view-title=\"My Bag\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.settings>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-clear\">Edit</button></ion-nav-buttons><ion-content><p>List of clubs for the logged in user, with a way to add, edit, remove clubs from the list. Each club also has editable attributes.</p></ion-content></ion-view>");
$templateCache.put("templates/account/preferences.html","<ion-view view-title=Preferences><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.settings>Back</button></ion-nav-buttons><ion-content><p>Preference settings governing app behavior</p></ion-content></ion-view>");
$templateCache.put("templates/account/register.html","<ion-view view-title=Register><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=login>Back</button></ion-nav-buttons><ion-content><div class=row><div class=col><form ng-submit=doRegister() novalidate><div class=list><label class=\"item item-input\"><span class=input-label>Email</span> <input type=email name=email ng-model=registration.email></label> <label class=\"item item-input\"><span class=input-label>Password</span> <input type=password name=password ng-model=registration.password></label> <label class=\"item item-input\"><span class=input-label>Confirm Password</span> <input type=password name=confirm ng-model=registration.confirmPassword></label> <label class=item><button class=\"button button-block button-positive\" type=submit>Register</button></label></div><div class=row ng-show=registration.hasError><div class=col><p>{{ registration.error }}</p></div></div></form></div></div></ion-content></ion-view>");
$templateCache.put("templates/account/settings.html","<ion-view view-title=Settings><ion-content><button class=\"button button-block\" ui-sref=^.my-bag>My Clubs</button> <button class=\"button button-block\" ui-sref=^.preferences>Preferences</button><p>You are logged in as {{user.name}}</p><button class=\"button button-block\" ng-click=doLogout()>Log Out</button></ion-content></ion-view>");
$templateCache.put("templates/rounds/approach-summary.html","<ion-view view-title=\"Approach Shots\"><ion-content scroll=false has-bouncing=false nav-prev=^.teeball-summary><p>Round id: {{ round.id }}</p><p>The green SVG image with all approach shots charted.</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/approach.html","<ion-view view-title=\"Approach Shot\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-shortgame nav-prev=^.round-detail-teeball><p>Round id: {{ round.id }}</p><p>Custom SVG control to capture the approach shot for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/create.html","<ion-view view-title=\"New Round\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.rounds>Back</button></ion-nav-buttons><ion-content><p>Form to create a new round and go directly to data-entry.</p><a class=\"button button-assertive\" ui-sref=\"^.round-detail-teeball({id: 400, hole: 1})\">Start</a></ion-content></ion-view>");
$templateCache.put("templates/rounds/goto.html","<ion-popover-view><ion-pane><h1>Go To Specific Hole</h1></ion-pane></ion-popover-view>");
$templateCache.put("templates/rounds/hole.html","<ion-view view-title=\"Round Detail\"><ion-tabs class=\"tabs-top tabs-stable\"><ion-tab title=\"Tee Ball\" ui-sref=tab.round-detail.teeball><ion-nav-view name=teeball></ion-nav-view></ion-tab><ion-tab title=Approach ui-sref=tab.round-detail.approach><ion-nav-view name=approach></ion-nav-view></ion-tab><ion-tab title=\"Short Game\" ui-sref=tab.round-detail.shortgame><ion-nav-view name=shortgame></ion-nav-view></ion-tab></ion-tabs></ion-view>");
$templateCache.put("templates/rounds/list.html","<ion-view view-title=\"My Rounds\"><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-plus\" ui-sref=^.new-round></button></ion-nav-buttons><ion-content><ion-list><ion-item ui-sref=\"tab.round-summary({id: 100})\">6/2/2015: Bunker Hills North to East Blue</ion-item><ion-item ui-sref=\"tab.round-summary({id: 200})\">6/5/2015: Bunker Hills North League</ion-item><ion-item ui-sref=\"tab.round-summary({id: 300})\">6/9/2015: Bunker Hills East to West White</ion-item></ion-list></ion-content></ion-view>");
$templateCache.put("templates/rounds/round-summary.html","<ion-view view-title=\"Round Overview\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ui-sref=^.rounds>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear\" ng-click=gotoDetails()>Details</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.teeball-summary><p>Round id: {{ round.id }}</p><p>Controls to enter the basic round statistics (fairways hit, gir, putts, etc.)</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/shortgame.html","<ion-view view-title=\"Short Game\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-teeball nav-prev=^.round-detail-approach><p>Round id: {{ round.id }}</p><p>Controls to capture short game information for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/teeball-summary.html","<ion-view view-title=\"Tee Shots\"><ion-content scroll=false has-bouncing=false nav-next=^.approach-summary nav-prev=^.round-summary><p>Round id: {{ round.id }}</p><p>The fairway SVG image with all tee shots charted.</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/teeball.html","<ion-view view-title=\"Tee Shot\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-approach nav-prev=^.round-detail-shortgame><p>Round id: {{ round.id }}</p><p>Custom SVG control to capture tee shot for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("templates/stats/approach.html","<ion-view view-title=\"Approach Shots\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.teeball nav-next=^.shortgame><p>Approach-only numerical statistics, trends, and heat map for the current period.</p></ion-content></ion-view>");
$templateCache.put("templates/stats/filter.html","<ion-popover-view><ion-content><h1>Filter Settings</h1></ion-content></ion-popover-view>");
$templateCache.put("templates/stats/overall.html","<ion-view view-title=Overall><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.shortgame nav-next=^.teeball><p>Overall statistics and trends for the current period.</p></ion-content></ion-view>");
$templateCache.put("templates/stats/shortgame.html","<ion-view view-title=\"Short Game\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.approach nav-next=^.overall><p>Short-game-only numerical statistics and trends for the current period.</p></ion-content></ion-view>");
$templateCache.put("templates/stats/stats.html","<ion-view><ion-nav-view name=stats-detail></ion-nav-view></ion-view>");
$templateCache.put("templates/stats/teeball.html","<ion-view view-title=\"Tee Shots\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.overall nav-next=^.approach><p>Teeball-only numerical statistics, trends, and heat map for the current period.</p></ion-content></ion-view>");}]);