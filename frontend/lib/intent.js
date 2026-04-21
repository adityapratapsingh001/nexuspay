export function intent_generate(payeeAmount, order_id) {
  const UPIID = "BHARATPE09904145219@yesbankltd";
  let upiUri =
    `upi://pay?pa=`+ UPIID +
    `&pn=Ayush Shukla` +
    `&mc=` +
    `&tid=` +
    `&tr=` +
    `&tn=`+ order_id +
    `&am=${payeeAmount}` +
    `&cu=INR` +
    `&refUrl=http://localhost:3000/verify-payment`;

  return upiUri.replace(/ /g, "+");
}
