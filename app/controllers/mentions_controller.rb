class MentionsController < ApplicationController
  def index
    @users = User.all

    respond_to do |format|
      format.json
    end
  end
end
