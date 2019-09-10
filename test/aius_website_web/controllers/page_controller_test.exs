defmodule AiusWebsiteWeb.PageControllerTest do
  use AiusWebsiteWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "AIUS"
  end
end
