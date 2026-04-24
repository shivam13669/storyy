import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import img404 from "@/assets/404.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial, sans-serif;
        }

        .notfound-page{
          min-height:100vh;
          background:#f7f7f7;
          display:flex;
          justify-content:center;
          align-items:flex-start;
          overflow:hidden;
        }

        .container{
          width:100%;
          text-align:center;
        }

        .error-img{
          width:520px;
          max-width:95%;
          display:block;
          margin:0 auto;
          animation:float 4s ease-in-out infinite;
        }

        @keyframes float{
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-10px);}
        }

        .title{
          margin-top:60px;
          font-size:22px;
          font-weight:bold;
          letter-spacing:6px;
          color:#48507a;
        }

        .btn{
          display:inline-block;
          margin-top:35px;
          padding:16px 42px;
          background:#ff912e;
          color:#fff;
          text-decoration:none;
          border-radius:40px;
          font-size:15px;
          transition:.3s ease;
          box-shadow:0 10px 25px rgba(255,145,46,.25);
        }

        .btn:hover{
          transform:translateY(-4px);
        }

        @media(max-width:768px){
          .error-img{
            width:320px;
          }

          .title{
            font-size:16px;
            letter-spacing:3px;
          }

          .btn{
            padding:14px 28px;
            font-size:14px;
          }
        }
      `}</style>

      <div className="notfound-page">
        <div className="container">
          <img src={img404} className="error-img" alt="404" />

          <div className="title">OPPS! PAGE NOT FOUND</div>

          <Link to="/" className="btn">
            BACK TO HOME
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
