defmodule AiusWebsiteWeb.AuthView do
  use AiusWebsiteWeb, :view

  def render("index.json", %{authorization_uri: uri, jwk: jwk}) do
    %{uri: uri, jwk: jwk}
  end
end
