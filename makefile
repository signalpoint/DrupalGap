# Create the list of files
files = src/v2/index.js\
                                src/v2/includes/block.inc.js\
                                src/v2/includes/common.inc.js\
                                src/v2/includes/connect.inc.js\
                                src/v2/includes/deprecated.inc.js\
                                src/v2/includes/devel.inc.js\
                                src/v2/includes/entity.inc.js\
                                src/v2/includes/field.inc.js\
                                src/v2/includes/file.inc.js\
                                src/v2/includes/form.elements.inc.js\
                                src/v2/includes/form.inc.js\
                                src/v2/includes/form.submission.inc.js\
                                src/v2/includes/form.theme.inc.js\
                                src/v2/includes/go.inc.js\
                                src/v2/includes/helpers.inc.js\
                                src/v2/includes/init.inc.js\
                                src/v2/includes/menu.inc.js\
                                src/v2/includes/module.inc.js\
                                src/v2/includes/page.inc.js\
                                src/v2/includes/region.inc.js\
                                src/v2/includes/render.inc.js\
                                src/v2/includes/route.inc.js\
                                src/v2/includes/theme.inc.js\
                                src/v2/modules/dg_admin/dg_admin.js\
                                src/v2/modules/dg_autocomplete/dg_autocomplete.js\
                                src/v2/modules/dg_bootstrap/dg_bootstrap.js\
                                src/v2/modules/dg_entity/dg_entity.js\
                                src/v2/modules/dg_field/dg_field.js\
                                src/v2/modules/dg_image/dg_image.js\
                                src/v2/modules/dg_menu/dg_menu.js\
                                src/v2/modules/dg_node/dg_node.js\
                                src/v2/modules/dg_options/dg_options.js\
                                src/v2/modules/dg_services/dg_services.js\
                                src/v2/modules/dg_system/dg_system.js\
                                src/v2/modules/dg_text/dg_text.js\
                                src/v2/modules/dg_user/dg_user.js\

.DEFAULT_GOAL := all

all: ${files}
				@echo "Generating aggregated drupalgap.js file"
				@cat > drupalgap.js $^
				@echo "done."

