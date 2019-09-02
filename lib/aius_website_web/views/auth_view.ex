defmodule AiusWebsiteWeb.AuthView do
  use AiusWebsiteWeb, :view

  def render("index.json", %{authorization_uri: uri}) do
    %{uri: uri}
  end
end
