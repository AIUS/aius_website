defmodule AiusWebsiteWeb.Router do
  use AiusWebsiteWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", AiusWebsiteWeb do
    pipe_through :api

    resources "/users", UserController do
      resources "/memberships", MembershipController
    end

    resources "/periods", PeriodController

    get "/auth/uri", AuthController, :uri
  end

  forward "/health", AiusWebsiteWeb.HealthPlug

  scope "/", AiusWebsiteWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
