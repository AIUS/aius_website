# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :aius_website,
  ecto_repos: [AiusWebsite.Repo]

# Configures the endpoint
config :aius_website, AiusWebsiteWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "fGXJjlB+7XTMCU0HLZD/xV93QLfyM1LvODwQjQ/QPKa0COXJe2nS7GaszluKZWIG",
  render_errors: [view: AiusWebsiteWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: AiusWebsite.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :aius_website, :openid_connect_providers,
  aius: [
    discovery_document_uri:
      "https://sso.aius.u-strasbg.fr/realms/master/.well-known/openid-configuration",
    response_type: "id_token",
    scope: "openid email profile",
    client_id: "aius-website"
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
