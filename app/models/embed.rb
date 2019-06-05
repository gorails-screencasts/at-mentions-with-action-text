class Embed
  include ActionText::Attachable
  include GlobalID::Identification
  include ActiveModel::Model

  attr_reader :id, :url, :state, :thumbnail, :youtube_id

  def self.find(url)
    new(url)
  end

  def initialize(url)
    @url = url
    @id  = url
    @state = "pending"
    @youtube_id = youtube_id
    lookup
  end

  def image_url
    "https://i.ytimg.com/vi/#{youtube_id}/hqdefault.jpg"
  end

  def lookup
    open("https://i.ytimg.com/vi/#{youtube_id}/hqdefault.jpg")
    @state = "active"
  rescue OpenURI::HTTPError
    @state = "not_found"
  end

  def content_type
    "embed/youtube-video"
  end

  def youtube_id
    chunks = url.gsub(/(>|<)/i,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    if chunks[2] != nil
      chunks[2].split(/[^0-9a-z_\-]/i).first
    else
      url
    end
  end

  def to_trix_content_attachment_partial_path
    "embeds/trix"
  end
end
