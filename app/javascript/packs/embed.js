class Embed {
  constructor(url)
    this.url = url
  }

  fetch() {
    Rails.ajax(
      url: `/${encodeURIComponent(this.sgid)}`
      success: this.didUpdate.bind(this)
    )
  }
}
function() {
    var t = function(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    };
    BC.Embed = function() {
        function e(e) {
            this.url = e,
            this.didUpdate = t(this.didUpdate, this),
            this.fetch = t(this.fetch, this),
            this.status = "new"
        }
        return e.getURL = function(t) {
            return null == t && (t = ""),
            BC.accountPath("/embeds" + t + ".json")
        }
        ,
        e.getPatterns = function(t) {
            return this.patterns ? t(this.patterns) : this.request ? this.request.then(function(e) {
                return function() {
                    return t(e.patterns)
                }
            }(this)) : (this.request = BC.fetch(this.getURL("/patterns"), {
                as: "json"
            }),
            this.request.then(function(e) {
                return function(n) {
                    var i, r;
                    return e.patterns = function() {
                        var t, e, o, s;
                        for (s = [],
                        t = 0,
                        e = n.length; t < e; t++)
                            o = n[t],
                            r = o.source,
                            i = o.options,
                            s.push(new RegExp(r,i));
                        return s
                    }(),
                    t(e.patterns)
                }
            }(this)))
        }
        ,
        e.prototype.save = function(t) {
            return this.callback = t,
            this.status = "pending",
            $.post(this.constructor.getURL(), {
                url: this.url
            }).done(this.didUpdate)
        }
        ,
        e.prototype.fetch = function() {
            return $.get(this.constructor.getURL("/" + encodeURIComponent(this.sgid))).done(this.didUpdate)
        }
        ,
        e.prototype.didUpdate = function(t) {
            return _.extend(this, t),
            "pending" === this.status ? setTimeout(this.fetch, 1e3) : (this.callback(this),
            delete this.callback)
        }
        ,
        e.prototype.toTrixAttachmentAttributes = function() {
            var t;
            return t = {
                href: this.url,
                contentType: this.content_type,
                sgid: this.sgid
            },
            this.image_url ? (t.previewable = !0,
            t.url = this.image_url) : t.content = this.content,
            t
        }
        ,
        e
    }()
}
.call(this),
function() {
    var t = function(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    };
    BC.EmbedController = function() {
        function e(e) {
            var n, i;
            n = e.element,
            i = e.urlInput,
            this.create = t(this.create, this),
            this.render = t(this.render, this),
            this.didInput = t(this.didInput, this),
            this.$element = $(n),
            this.$urlInput = $(i),
            this.installEventHandlers(),
            this.reset()
        }
        return e.prototype.template = "all/sections/embeds/dialog",
        e.prototype.reset = function() {
            return this.embed = new BC.Embed,
            this.render()
        }
        ,
        e.prototype.installEventHandlers = function() {
            return this.$urlInput.on("input focusin", this.didInput),
            this.$element.on("click", "[data-behavior~=embed_url]", this.create)
        }
        ,
        e.prototype.didInput = function() {
            return BC.Embed.getPatterns(function(t) {
                return function(e) {
                    return e.some(function(e) {
                        return e.test(t.$urlInput.val())
                    }) ? (t.embed.url = t.$urlInput.val().trim(),
                    t.render()) : t.reset()
                }
            }(this))
        }
        ,
        e.prototype.render = function() {
            return this.$element.html(JST[this.template]({
                embed: this.embed
            }))
        }
        ,
        e.prototype.create = function() {
            return this.embed.save(function(t) {
                return function() {
                    return "active" === t.embed.status ? (t.didCreate(),
                    t.reset()) : t.render()
                }
            }(this)),
            this.render()
        }
        ,
        e.prototype.didCreate = function() {}
        ,
        e
    }()
}
.call(this),
function() {
    var t, e = function(t, e) {
        function i() {
            this.constructor = t
        }
        for (var r in e)
            n.call(e, r) && (t[r] = e[r]);
        return i.prototype = e.prototype,
        t.prototype = new i,
        t.__super__ = e.prototype,
        t
    }, n = {}.hasOwnProperty;
    t = function(t) {
        function n(t) {
            this.editorElement = t.editorElement,
            n.__super__.constructor.apply(this, arguments)
        }
        return e(n, t),
        n.prototype.didCreate = function() {
            return this.insertEmbed()
        }
        ,
        n.prototype.insertEmbed = function() {
            var t, e;
            return t = new Trix.Attachment(this.embed.toTrixAttachmentAttributes()),
            e = Trix.Text.textForAttachmentWithAttributes(t),
            this.editorElement.editor.insertText(e),
            this.editorElement.focus()
        }
        ,
        n
    }(BC.EmbedController),
    $(document).on("trix-initialize", function(e) {
        var n, i, r, o;
        return o = e.target,
        i = $(o.toolbarElement).find("[data-trix-dialog=href]"),
        r = i.find("[data-trix-input][name=href]"),
        n = i.find("[data-behavior='embed_container']"),
        n.length || (n = $('<div data-behavior="embed_container"></div>'),
        i.append(n)),
        new t({
            editorElement: o,
            element: n,
            urlInput: r
        })
    })
}
.call(this),
