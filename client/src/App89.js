import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import InstitutionManager from "./contracts/InstitutionManager.json";
import {INSTITUTION_CONTRACT} from "./config.js"
import getWeb3 from "./getWeb3";


import "./App.css";
import "./css/sb-admin-2.css"
import SideBar from "./SideBar";

class App extends Component {
    render() {
        
          return(<div>
              <SideBar/>
              <div id="content-wrapper" class="d-flex flex-column">
              <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>Copyright &copy; Your Website 2021</span>
                    </div>
                </div>
            </footer>
            </div>
          </div>    )}
}

export default App;


