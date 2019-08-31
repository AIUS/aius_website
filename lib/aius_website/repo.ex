defmodule AiusWebsite.Repo do
  use Ecto.Repo,
    otp_app: :aius_website,
    adapter: Ecto.Adapters.Postgres
end
