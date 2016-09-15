/* jshint ignore:start */ define( 'communitypage.templates.mustache', [], function() { 'use strict'; return {
    "CommunityPageSpecial_index" : '{{>pageHeader}}<div class="CommunityPageContainer"><div class="CommunityPageMainContent">{{>communityTodoListModule}}{{#insightsModules.modules}}{{>insightsModule}}{{/insightsModules.modules}}</div><div class="WikiaRail">{{>helpModule}}{{>adminsModule}}{{#contributorsModuleEnabled}}{{>contributorsModule}}{{/contributorsModuleEnabled}}{{>communityPolicyModule}}{{>recentActivityModule}}</div></div>',"adminsModule" : '<div class="module contributors-module admins-module">{{#topAdminsData}}{{>topAdmins}}{{/topAdminsData}}</div>',"allAdmins" : '<div class="community-page-all-contributors-legend">{{allAdminsLegend}}</div><ul class="reset top-contributors">{{#allAdminsList}}<li class="community-page-contributors-list-item"><div class="avatar-container"><a data-tracking="all-admins-user-avatar" href="{{profilePage}}">{{{avatar}}}</a></div><div class="community-page-contributor-details"><a data-tracking="all-admins-user" href="{{profilePage}}">{{userName}}</a>{{#isAdmin}}<span class="community-page-subtle">{{admin}}</span>{{/isAdmin}}</div><div class="community-page-details">{{timeAgo}}</div></li>{{/allAdminsList}}{{^allAdminsList}}<div class="community-page-zero">{{noAdminText}}<a href="{{noAdminHref}}">{{noAdminContactText}}</a></div>{{/allAdminsList}}</ul>',"allMembers" : '<div class="community-page-all-contributors-legend">{{allContributorsLegend}}</div><ul class="reset top-contributors">{{#members}}<li class ="community-page-contributors-list-item {{#isCurrent}}community-page-current-contributor{{/isCurrent}}"><div class="avatar-container"><a data-tracking="all-members-user-avatar" href="{{profilePage}}">{{{avatar}}}</a></div><div class="community-page-contributor-details"><a data-tracking="all-members-user" href="{{profilePage}}">{{userName}}</a>{{#isAdmin}}<span class="community-page-subtle">{{admin}}</span>{{/isAdmin}}</div><div class="community-page-details">{{timeAgo}}</div></li>{{/members}}{{^members}}<div class="community-page-zero">{{noMembersText}}</div>{{/members}}{{#haveMoreMembers}}<li class="community-page-contributors-list-item"><div class="contributor-details"><a href="{{moreMembersLink}}">{{moreMembersText}}</a></div></li>{{/haveMoreMembers}}</ul>',"benefitsModal" : '<a href="#" class="close community-page-benefits-modal-close" title="close">close</a><a href="{{ buttonUrl }}" class="community-page-benefits-modal-area"><section class="community-page-benefits-container" data-track="benefits-image"><img class="community-page-benefits-image" src="{{ benefitsImageUrl }}" /></section><section class="community-page-benefits-content"><section class="community-page-benefits-modal-text"><h2 class="community-page-benefits-modal-main-title" data-track="main-title">{{ mainTitle }}</h2><span class="community-page-benefits-modal-edit-icon" data-track="edit-icon"></span><div class="community-page-benefits-modal-message"><h3 class="community-page-benefits-modal-section-title" data-track="edit-title">{{ editSubtitle }}</h3><p>{{ editText }}</p></div><span class="community-page-benefits-modal-connect-icon" data-track="connect-icon"></span><div class="community-page-benefits-modal-message"><h3 class="community-page-benefits-modal-section-title" data-track="connect-title">{{ connectSubtitle }}</h3><p>{{ connectText }}</p></div><span class="community-page-benefits-modal-search-icon" data-track="explore-icon"></span><div class="community-page-benefits-modal-message"><h3 class="community-page-benefits-modal-section-title" data-track="explore-title">{{ exploreSubtitle }}</h3><p>{{ exploreText }}</p></div></section><section class="community-page-benefits-modal-action-point"><div class="community-page-entry-point-button" data-track="entry-point-button">{{ buttonText }}</div></section></section></a>',"communityPolicyModule" : '{{#communityPolicyModule}}<div class="module community-policy-module">{{#showEditLink}}<a data-tracking="edit-community-page-policy" class="community-page-policy-edit" href="{{editLink}}">{{editText}}</a>{{/showEditLink}}<h2>{{title}}</h2><p class="community-page-policy-text">{{text}}</p><a data-tracking="view-community-page-policy" href="{{link}}">{{linkText}}&nbsp;&rarr;</a></div>{{/communityPolicyModule}}',"communityTodoListModule" : '{{#communityTodoListModule}}<section class="community-page-todo-list-module"><div class="community-page-todo-list-module-header">{{heading}}</div>{{#showEditLink}}<div class="community-page-todo-list-module-edit"><a data-tracking="community-page-todo-list-module-edit" href="{{editUrl}}" target="_blank"><div class="community-page-todo-list-module-edit-icon"></div>{{editList}}</a></div>{{/showEditLink}}<div class="community-page-todo-list-module-description">{{description}}</div>{{#isZeroState}}<div class="community-page-todo-list-module-zerostate">{{{zeroStateText}}}</div>{{/isZeroState}}{{^isZeroState}}<div class="community-page-todo-list-module-content">{{{data}}}</div>{{/isZeroState}}</section>{{/communityTodoListModule}}',"contributorsModule" : '<div class="module contributors-module">{{#topContributors}}{{>topContributors}}{{/topContributors}}{{#recentlyJoined}}{{>recentlyJoined}}{{/recentlyJoined}}</div>',"firstEditModal" : '<div class="community-page-header-image"></div><div class="community-page-first-edit-heading">{{heading}}</div><div class="community-page-first-edit-subheading">{{subheading}}</div><div class="community-page-first-edit-getstarted"><a href="{{getStartedLink}}" class="community-page-first-edit-button" data-tracking="first-edit-get-started">{{getStarted}}</a></div><div class="community-page-first-edit-maybelater"><a href="#" id="community-page-first-edit-maybelater-button" data-tracking="first-edit-maybe-later">{{maybeLater}}</a></div>',"helpModule" : '<div class="module help-module"><h2>{{helpModule.title}}</h2><a data-tracking="help-page-edit-page-link" href="{{helpModule.editPageLink}}">{{helpModule.editPage}}&nbsp;&rarr;</a><br/><a data-tracking="help-page-add-links-page-link" href="{{helpModule.addLinksPageLink}}">{{helpModule.addLinks}}&nbsp;&rarr;</a><br/><a data-tracking="help-page-add-new-page-link" href="{{helpModule.addNewPageLink}}">{{helpModule.addNewPage}}&nbsp;&rarr;</a></div>',"insightsModule" : '<section class="community-page-card-module" data-tracking="community-page-insights-{{type}}"><h3 class="community-page-card-module-header">{{title}}</h3><p class="community-page-card-module-description">{{description}}</p>{{#fulllistlink}}<a class="community-page-card-module-full-list-link" href="{{fulllistlink}}" data-tracking="view-full-list">{{insightsModules.messages.fulllist}}&nbsp;&rarr;</a>{{/fulllistlink}}<ul class="community-page-card-module-list">{{#pages}}<li class="community-page-card-module-list-item"><a class="community-page-card-module-edit-icon" href="{{editlink}}" data-tracking="edit-icon"></a><span class="community-page-card-module-article-data"><a href="{{link.articleurl}}" data-tracking="page-link">{{link.text}}</a><div class="community-page-card-module-metadata">{{{metadataDetails}}} {{#pageviews}}&middot; {{pageviews}}{{/pageviews}}</div></span><a class="community-page-card-module-edit-link" data-tracking="edit-link" href="{{editlink}}">{{edittext}}</a></li>{{/pages}}</ul></section>',"loadingError" : '<div>{{loadingError}}</div>',"modalHeader" : '<ul class="reset modal-nav"><li class="modal-nav-all"><a data-tracking="modal-tab-all" id="modalTabAll" class="modal-tab-link" href="#">{{allText}} <span id="allCount">{{allMembersCount}}</span></a></li><li class="modal-nav-admins"><a data-tracking="modal-tab-admins" id="modalTabAdmins" class="modal-tab-link" href="#">{{adminsText}} <span id="allAdminsCount">{{allAdminsCount}}</span></a></li>{{#contributorsModuleEnabled}}<li class="modal-nav-leaderboard"><a data-tracking="modal-tab-leaderboard" id="modalTabLeaderboard" class="modal-tab-link" href="#">{{leaderboardText}}</a></li>{{/contributorsModuleEnabled}}</ul>',"modalLoadingScreen" : '<div class="throbber-placeholder"></div>',"pageHeader" : '<div class="community-page-header {{#heroImageUrl}}community-page-header-cover" style="background-image: url({{heroImageUrl}});{{/heroImageUrl}}"><div class="community-page-header-content"><h1 class="community-page-heading">{{{headerWelcomeMsg}}}</h1></div></div><div class="community-page-admin-welcome-message"><p class="community-page-admin-welcome-message-text">{{adminWelcomeMsg}}</p></div>',"recentActivityModule" : '{{#recentActivityModule}}<div class="module recent-activity-module"><h2 class="activity-heading">{{activityHeading}}</h2><ul class="reset recent-changes">{{#activity}}<li class="community-page-recent-activity-item"><div class="avatar-container"><a data-tracking="user-avatar-link" href="{{profilePage}}">{{{userAvatar}}}</a></div><div class="community-page-recent-activity-item-info"><div class="change-message">{{{changeMessage}}}</div>{{#timeAgo}}<div class="community-page-subtle">{{timeAgo}}</div>{{/timeAgo}}</div></li>{{/activity}}</ul><a data-tracking="view-all-activity-link" href="{{moreActivityLink}}">{{moreActivityText}}&nbsp;&rarr;</a></div>{{/recentActivityModule}}',"recentlyJoined" : '<section class="community-page-contributors-module-section community-page-recently-joined">{{#haveNewMembers}}<div class="members"><h2>{{recentlyJoinedHeaderText}}</h2>{{#members}}<div class="avatar-container"><a data-tracking="recently-joined-user-avatar" href="{{profilePage}}">{{{avatar}}}</a></div>{{/members}}</div>{{/haveNewMembers}}<span class="more-link"><a data-tracking="show-modal-all" href="#" id="viewAllMembers">{{allMembers}}&nbsp;&rarr;</a></span></section>',"topAdmins" : '<section class="community-page-contributors-module-section top-admins"><h2>{{topAdminsHeaderText}}</h2><ul class="reset">{{#topAdminsList}}<li class="community-page-contributors-list-item"><div class="avatar-container"><a data-tracking="top-admins-user-avatar" href="{{profilePage}}">{{{avatar}}}</a></div><div class="community-page-contributor-details"><a data-tracking="top-admins-user" href="{{profilePage}}">{{userName}}</a></div></li>{{/topAdminsList}}{{^topAdminsList}}<div class="community-page-zero">{{noAdminText}}<a href="{{noAdminHref}}">{{noAdminContactText}}</a></div>{{/topAdminsList}}{{#haveOtherAdmins}}<li class="community-page-contributors-list-item" id="openModalTopAdmins"><div class="avatar-container avatar-more">+{{otherAdminsCount}}</div><div class="community-page-contributor-details"><a href="">{{otherAdmins}}</a></div></li>{{/haveOtherAdmins}}</ul></section>',"topContributors" : '<section class="community-page-contributors-module-section"><h2>{{topContribsHeaderText}}</h2>{{#isAnon}}<div class="community-page-anon-text">{{{anonText}}}</div>{{/isAnon}}{{^isAnon}}<div class="user-details"><div class="avatar-container">{{{userAvatar}}}</div><div class="community-page-rank"><span>{{userRank}} <small>/ {{weeklyEditorCount}}</small></span><span class="community-page-subtle">{{yourRankText}}</span></div><div class="user-contrib-count"><span>{{userContribCount}}</span><span class="community-page-subtle">{{userContributionsText}}</span></div></div>{{/isAnon}}<ul class="reset top-contributors">{{#contributors}}<li class="community-page-contributors-list-item"><div class="avatar-container"><a data-tracking="top-contributors-user-avatar" href="{{profilePage}}">{{{avatar}}}</a></div><div class="community-page-contributor-rank">{{count}}.</div><div class="community-page-contributor-details"><a data-tracking="top-contributors-user" href="{{profilePage}}">{{userName}}</a><span class="community-page-subtle">{{contributionsText}}</span></div></li>{{/contributors}}{{^contributors}}<div class="community-page-zero">{{noContribsText}}</div>{{/contributors}}</ul></section>',"topContributorsModal" : '{{^isAnon}}<div class="user-details"><div class="avatar-container">{{{userAvatar}}}</div><div class="community-page-rank"><span>{{userRank}} <small>/ {{weeklyEditorCount}}</small></span><span class="community-page-subtle">{{yourRankText}}</span></div><div class="user-contrib-count"><span>{{userContribCount}}</span><span class="community-page-subtle">{{userContributionsText}}</span></div></div>{{/isAnon}}<ul class="reset top-contributors">{{#contributors}}<li class="community-page-contributors-list-item"><div class="avatar-container"><a data-tracking="top-contributors-user-avatar" href="{{profilePage}}">{{{avatar}}}</a></div><div class="community-page-contributor-rank">{{count}}.</div><div class="community-page-contributor-details"><a data-tracking="top-contributors-user" href="{{profilePage}}">{{userName}}</a>{{#isAdmin}}<span class="community-page-subtle">{{admin}}</span>{{/isAdmin}}</div><div class="community-page-details">{{contributionsText}}</div></li>{{/contributors}}{{^contributors}}<div class="community-page-zero">{{noContribsText}}</div>{{/contributors}}</ul>',
    "done": "true"
  }; }); /* jshint ignore:end */
