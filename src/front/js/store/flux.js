const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      setStore: () => setStore(),
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      syncTokenFromSessionStore: () => {
        const token = sessionStorage.getItem(token);
        console.log("Application just loaded syncing local storage");
        if (token && token !== "" && token !== undefined)
          setStore({ token: token });
      },
      logout: () => {
        sessionStorage.removeItem("token");
        console.log("logging out");
        setStore({ token: null });
      },

      login: async (email, password) => {
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        };
        try {
          const resp = await fetch(
            "https://3001-santagosu-authentificat-1u0010ihh8b.ws-us71.gitpod.io/api/token",
            opts
          );
          if (resp.status !== 200) {
            alert("Error: " + resp.status);
            return false;
          }
          const data = await resp.json();
          console.log("this came from the backend" + data);
          sessionStorage.setItem("token", data.access_token);
          setStore({ token: data.access_token });
          return true;
        } catch (err) {
          console.log("there has been an error");
        }
      },
      signup: async (email, password) => {
				const ops = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})

				}

				try {
				const resp = await fetch('https://3001-santagosu-authentificat-1u0010ihh8b.ws-us71.gitpod.io/api/signup', {ops})
				if (resp.status !== 200) {
				alert("There has been an error")
				return false
				}
				const data = await resp.json();		
				sessionStorage.setItem("token", data.access_token)
				setStore({token: data.access_token})
				actions.setStore({email: email})
					
				}
				catch (err) {
					console.error(err);
				}
			},

      getMessage: async () => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
        };
        // fetching data from the backend
        const resp = await fetch(
          "https://3001-santagosu-authentificat-1u0010ihh8b.ws-us71.gitpod.io/api/hello",
          opts
        )
          .then((resp) => resp.json())
          .then((data) => setStore({ message: data.message }))
          .catch((error) => console.log("Error loading message: " + error));
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
