Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :polls, only: [:index, :show, :create, :update]
      resources :votes, only: [:create]
    end
  end

  get "up" => "rails/health#show"
  mount ActionCable.server => '/cable'
end
