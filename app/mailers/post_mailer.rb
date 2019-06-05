class PostMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.post_mailer.user_mention.subject
  #
  def user_mention(post, user)
    @post, @user = post, user
    mail to: user.email, subject: "You have been mentioned in a post"
  end
end
