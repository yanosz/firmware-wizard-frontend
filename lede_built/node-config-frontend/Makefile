include $(TOPDIR)/rules.mk

# Name, version and release number
# The name and version of your package are used to define the variable to point to the build directory of your package: $(PKG_BUILD_DIR)
PKG_NAME:=node-config-frontend
PKG_VERSION:=1.0
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

# Package definition; instructs on how and where our package will appear in the overall configuration menu ('make menuconfig')
define Package/node-config-frontend
	SECTION:=freifunk
	CATEGORY:=Freifunk
	TITLE:=Frontend for Node Config Scripts
	DEPENDS:=+coreutils-base64 +uhttpd-mod-ubus
endef

# Package description; a more verbose description on what our package does
define Package/node-config-frontend/description
    AngularJS frontend for:
	DIY Freifunk-Router - see https://github.com/yanosz/node-config-frontend for details.
endef

# Package preparation instructions; create the build directory and copy the source code.
# The last command is necessary to ensure our preparation instructions remain compatible with the patching system.
define Build/Prepare
	cd ../../ && NODE_ENV_production npm run build
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ../../dist $(PKG_BUILD_DIR)
	$(CP) ../../files $(PKG_BUILD_DIR)
	cp Makefile $(PKG_BUILD_DIR)
endef

define Build/Compile/Default

endef
Build/Compile = $(Build/Compile/Default)

define Package/node-config-frontend/install
	$(INSTALL_DIR) $(1)/www
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_DIR) $(1)/usr/libexec
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d/
	$(CP) $(PKG_BUILD_DIR)/dist/* $(1)/www
	$(INSTALL_BIN)  $(PKG_BUILD_DIR)/files/uci-defaults $(1)/etc/uci-defaults/ff-wizard-frontend
	$(INSTALL_BIN)  $(PKG_BUILD_DIR)/files/ffwizard.sh $(1)/usr/libexec/ffwizard.sh
	$(INSTALL_BIN)  $(PKG_BUILD_DIR)/files/ffwizard.json $(1)/usr/share/rpcd/acl.d/ffwizard.json
endef

$(eval $(call BuildPackage,node-config-frontend))
