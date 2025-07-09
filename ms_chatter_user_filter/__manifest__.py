{
    "name": "Chatter User Filter",
    "version": "18.0.1.0.0",
    "summary": "Filter chatter content by user",
    "author": "Mohammed Shahil",
    "website": "http://www.shahil.info",
    "license": "OPL-1",
    "depends": ["mail"],
    "category": "Extra Tools",
    "assets": {
        "web.assets_backend": [
            "ms_chatter_user_filter/static/src/chatter/web/chatter.xml",
            "ms_chatter_user_filter/static/src/chatter/web/chatter_patch.js",
        ],
    },
    "installable": True,
    "application": False,
}
