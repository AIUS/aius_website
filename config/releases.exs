import Config

config :aius_website, AiusWebsiteWeb.Endpoint,
  http: [port: String.to_integer(System.fetch_env!("PORT"))],
  url: [host: System.fetch_env!("HOST"), scheme: "https", port: 443],
  server: true,
  secret_key_base: System.fetch_env!("SECRET_KEY_BASE")

config :aius_website, AiusWebsite.Repo,
  hostname: System.fetch_env!("DB_HOSTNAME"),
  username: System.fetch_env!("DB_USERNAME"),
  password: System.fetch_env!("DB_PASSWORD"),
  database: System.fetch_env!("DB_NAME"),
  pool_size: String.to_integer(System.fetch_env!("DB_POOL_SIZE"))
