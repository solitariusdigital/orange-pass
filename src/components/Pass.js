import React, { useEffect, useState, useContext } from "react";
import { db, analytics } from "../fb config/firebase";
import { AppContext } from "../AppContext";
import history from "../history";
import loadingGif from "../assets/Loading.png";

import "../styles/components/pass.scss";

export default function Pass({ match }) {
  const [loading, setLoading] = useState(false);
  const [clientLogo, setClientLogo] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { returnUser, setReturnUser } = useContext(AppContext);
  const { returnUserData, setReturnUserData } = useContext(AppContext);

  useEffect(() => {
    setLoading(true);
    setIsButtonDisabled(true);

    db.collection("locations")
      .where("url", "==", match.params.location)
      .get()
      .then((snapshot) => {
        let resp = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setClientLogo(resp[0].logo);
        fetchData(resp[0].id);

        if (
          localStorage.getItem("OrangePassCustomId") !== null &&
          !localStorage.getItem("OrangePassonSiteLogIn")
        ) {
          getUserData(
            resp[0].id,
            JSON.parse(localStorage.getItem("OrangePassCustomId"))
          );
          setReturnUser(true);
        }
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    analytics.logEvent("page_view", {
      locationName: `${match.params.location}`,
    });
  }, [match.params.location, setReturnUser]);

  const getUserData = (id, uid) => {
    db.collection("locations")
      .doc(id)
      .collection("residents")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.id === uid) {
            setReturnUserData(doc.data());
          }
        });
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });
  };

  const fetchData = (id) => {
    db.collection("locations")
      .doc(id)
      .collection("rules")
      .get()
      .then((snapshot) => {
        let rules = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("rules", JSON.stringify(rules));
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(id)
      .collection("questions")
      .get()
      .then((snapshot) => {
        let questions = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("questions", JSON.stringify(questions));
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(id)
      .collection("message")
      .get()
      .then((snapshot) => {
        let questions = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("message", JSON.stringify(questions));
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(id)
      .collection("warning")
      .get()
      .then((snapshot) => {
        let questions = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("warning", JSON.stringify(questions));
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(id)
      .collection("inputs")
      .get()
      .then((snapshot) => {
        let inputs = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("inputs", JSON.stringify(inputs));
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    setLoading(false);
    setIsButtonDisabled(false);
  };

  const navigatePage = () => {
    if (
      JSON.parse(sessionStorage.getItem("rules")).length > 0 &&
      JSON.parse(sessionStorage.getItem("rules"))[0].content !== ""
    ) {
      history.push(`/${match.params.location}/rules`);
    } else if (
      JSON.parse(sessionStorage.getItem("questions")).length > 0 &&
      JSON.parse(sessionStorage.getItem("questions"))[0].content !== ""
    ) {
      history.push(`/${match.params.location}/questions`);
    } else {
      history.push(`/${match.params.location}/submit`);
      sessionStorage.setItem("answer", "Not required");
    }
  };

  return (
    <React.Fragment>
      <div className="main-container">
        <div className="qr-container">
          {loading ? (
            <img className="loading" src={loadingGif} alt="Loading is here" />
          ) : null}

          {returnUser ? (
            <div>
              <h3>Welcome back</h3>
              <span>{returnUserData.fullname}</span>
            </div>
          ) : null}

          <div className="entry-option">
            <div>
              <span>Enter</span>
              <h2>to continue with the pass</h2>
            </div>
            <div className="logo-container">
              <img className="client-logo" src={clientLogo} alt="" />
              <button
                disabled={isButtonDisabled}
                onClick={() => navigatePage()}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
