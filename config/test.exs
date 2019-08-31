use Mix.Config

# Configure your database
config :aius_website, AiusWebsite.Repo,
  username: "postgres",
  password: "postgres",
  database: "aius_website_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :aius_website, AiusWebsiteWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn
