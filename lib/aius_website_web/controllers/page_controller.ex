defmodule AiusWebsiteWeb.PageController do
  use AiusWebsiteWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
