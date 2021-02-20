import React from "react";

class Header extends React.Component {

	render() {
		return (
			<>
				<div className="see-instruction fordeskview">
					<div className="d-flex align-items-center justify-content-center h-75">
						<div className="left-cap">
							<h1>
								<img
									className="fl"
									src={require("./../../assets/img/logo-new.png")}
									alt="LOGO"
								/>
							</h1>
						</div>

					</div>
				</div>
			</>
		);
	}
}

export default Header;