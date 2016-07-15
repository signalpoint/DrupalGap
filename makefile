# Create the list of files
files = src/dg.js\
                                src/includes/autocomplete.inc.js\
                                src/includes/block.inc.js\
                                src/includes/common.inc.js\
                                src/includes/form.elements.inc.js\
                                src/includes/form.inc.js\
                                src/includes/form.load.inc.js\
                                src/includes/form.submission.inc.js\
                                src/includes/form.theme.inc.js\
                                src/includes/go.inc.js\
                                src/includes/menu.inc.js\
                                src/includes/messages.inc.js\
                                src/includes/page.inc.js\
                                src/includes/region.inc.js\
                                src/includes/render.inc.js\
                                src/includes/theme.inc.js\
                                src/includes/title.inc.js\
                                src/modules/comment/comment.js\
                                src/modules/contact/contact.js\
                                src/modules/entity/entity.js\
                                src/modules/entity/entity.helpers.js\
                                src/modules/field/field.js\
                                src/modules/file/file.js\
                                src/modules/image/image.js\
                                src/modules/menu/menu.js\
                                src/modules/mvc/mvc.js\
                                src/modules/node/node.js\
                                src/modules/search/search.js\
                                src/modules/services/services.js\
                                src/modules/system/system.js\
                                src/modules/user/user.js\
                                src/modules/user/user.forms.js\
                                src/modules/taxonomy/taxonomy.js\
                                src/modules/views/views.js\

.DEFAULT_GOAL := all

all: ${files}
				@echo "Generating aggregated drupalgap.js file"
				@cat > bin/drupalgap.js $^
				@echo "done."

