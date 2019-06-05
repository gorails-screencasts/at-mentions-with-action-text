module ApplicationHelper
  def bootstrap_class_for(flash_type)
    {
      success: "alert-success",
      error: "alert-danger",
      alert: "alert-warning",
      notice: "alert-info"
    }.stringify_keys[flash_type.to_s] || flash_type.to_s
  end

  SANITIZER          = Rails::Html::Sanitizer.white_list_sanitizer
  ALLOWED_TAGS       = SANITIZER.allowed_tags + [ ActionText::Attachment::TAG_NAME, "figure", "figcaption", "iframe" ]
  ALLOWED_ATTRIBUTES = SANITIZER.allowed_attributes + ActionText::Attachment::ATTRIBUTES

  def render_action_text_content(content)
    content = content.render_attachments do |attachment|
      unless attachment.in?(content.gallery_attachments)
        attachment.node.tap do |node|
          node.inner_html = render(attachment, in_gallery: false).chomp
        end
      end
    end

    content = content.render_attachment_galleries do |attachment_gallery|
      render(layout: attachment_gallery, object: attachment_gallery) do
        attachment_gallery.attachments.map do |attachment|
          attachment.node.inner_html = render(attachment, in_gallery: true).chomp
          attachment.to_html
        end.join("").html_safe
      end.chomp
    end

    sanitize content.to_html, tags: ALLOWED_TAGS + ["iframe"], attributes: ALLOWED_ATTRIBUTES
  end
end
