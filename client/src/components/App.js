import React from "react";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Header from "./Header";
import Footer from "./Footer";
import { Provider } from "react-contextual";
import ClientRouter from "./ClientRouter/ClientRouter";
const store = {
  initialState: { jwtToken: null, user: {}, messages: {} },
  actions: {
    saveSession: (jwtToken, user) => ({ jwtToken, user }),
    clearSession: () => ({ jwtToken: null, user: {} }),
    clearMessages: () => ({ messages: {} }),
    setErrorMessages: errors => ({ messages: { error: errors } }),
    setSuccessMessages: success => ({ messages: { success: success } })
  }
};

class App extends React.Component {
  render() {
    return (
      <Provider {...store}>
        <CookiesProvider>
          <BrowserRouter>
            <div>
              <div className="body">
                <Header />
                <ClientRouter />
              </div>
              <div>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </CookiesProvider>
      </Provider>
    );
  }
}

export default App;
