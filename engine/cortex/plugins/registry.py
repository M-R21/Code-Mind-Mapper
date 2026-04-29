from .base import FrameworkPlugin

class PluginRegistry:
    def __init__(self):
        self.plugins: dict[str, FrameworkPlugin] = {}

    def register(self, plugin: FrameworkPlugin):
        self.plugins[plugin.plugin_id] = plugin

    def get_plugins_for_profile(self, profile) -> list[FrameworkPlugin]:
        active_plugins = []
        for pid in profile.plugins_to_load:
            if pid in self.plugins:
                active_plugins.append(self.plugins[pid])
        return active_plugins

registry = PluginRegistry()
