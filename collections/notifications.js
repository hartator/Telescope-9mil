Notifications = new Meteor.Collection('notifications');

Notifications.allow({
    insert: function(userId, doc){
      // new notifications can only be created via a Meteor method
      return false;
    }
  , update: canEditById
  , remove: canEditById
});

getNotification = function(event, properties, context){
  var notification = {};
  // the default context to display notifications is the notification sidebar
  var context = typeof context === 'undefined' ? 'sidebar' : context;
  var p = properties;
  switch(event){
    case 'newReply':
      notification.subject = 'Une personne a répondu à votre commentaire "'+p.postHeadline+'"';
      notification.text = p.commentAuthorName+' has replied to your comment on "'+p.postHeadline+'": '+getPostCommentUrl(p.postId, p.commentId);
      notification.html = '<p><a href="'+getUserUrl(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> has replied to your comment on "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postHeadline+'</a>"</p>';
      if(context === 'email')
        notification.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">Read more</a>';
    break;

    case 'newComment':
      notification.subject = 'A new comment on your post "'+p.postHeadline+'"';
      notification.text = 'You have a new comment by '+p.commentAuthorName+' on your post "'+p.postHeadline+'": '+getPostCommentUrl(p.postId, p.commentId);
      notification.html = '<p><a href="'+getUserUrl(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> left a new comment on your post "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postHeadline+'</a>"</p>';
      if(context === 'email')
        notification.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">Read more</a>';
    break;

    case 'newPost':
      notification.subject = p.postAuthorName+' has created a new post: "'+p.postHeadline+'"';
      notification.text = p.postAuthorName+' has created a new post: "'+p.postHeadline+'" '+getPostUrl(p.postId);
      notification.html = '<a href="'+getUserUrl(p.postAuthorId)+'">'+p.postAuthorName+'</a> has created a new post: "<a href="'+getPostUrl(p.postId)+'" class="action-link">'+p.postHeadline+'</a>".';      
    break;

    case 'accountApproved':
      notification.subject = 'Votre inscription a bien été enregistrée.';
      notification.text = 'Bienvenue '+getSetting('title')+'! Votre inscription a bien été enregistrée.';
      notification.html = 'Bienvenue '+getSetting('title')+'!<br/> Votre inscription a bien été enregistrée. <a href="'+Meteor.absoluteUrl()+'">Vous pouvez ajouter des liens dès maintenant !</a>';      
    break;

    default:
    break;
  }
  return notification;
}

Meteor.methods({
  markAllNotificationsAsRead: function() {
    Notifications.update(
      {userId: Meteor.userId()},
      {
        $set:{
          read: true
        }
      },
      {multi: true}
    );
  }
});
