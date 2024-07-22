/**
* @OnlyCurrentDoc
*
* The above comment directs Apps Script to limit the scope of file
* access for this add-on. It specifies that this add-on will only
* attempt to read or modify the files in which the add-on is used,
* and not all of the user's files. The authorization request message
* presented to users will reflect this limited scope.
*/
function onOpen() {
  var ui = SlidesApp.getUi();
  ui.createMenu('Trademark')
    .addItem('Company logo', 'mergeLogo')
    .addItem('Shopee logo', 'mergeShopeeLogo')
    .addItem('Lazada logo', 'mergeLazadaLogo')
    .addToUi();
}


function mergeLogo() {
  var templateId = SlidesApp.getActivePresentation().getId();

  //Logo url
  var logoUrl = "https://lh3.googleusercontent.com/fife/ALs6j_GrsxxIR8u6QYPzCvIO1cYgL31T28t8o-5s0G1ecHIj1l6q4Gaux4blUIXWYG-pm4XT1aQ2ohN1TPz-TdCh-cY7ry2gM-6h8dQQ3rYjJ_AvRpT1IMBwgRQUDPXXFaTQcgAV7Inl9PINeD-RVkzsp3NZWZicei_rHdgTmRzRtZg0C9_amZ6nEWuF7EUV3GxbYlHirtgTdCL4un7IK3dlMGJVoXehHLHamkZl-MB2DYS5AKhQkwphzpAyRx-T7xv15GPs8cH3YDCkcrohboFGwUsSudxiJ8vkwG4x68kEx7w0T_fWVs5hVJyIyaicPOOrdb8B_6-jV1C2Nxv35MrI6XaX9dngmvwc_PGIGeNZvZiIgKXTSVr2wXoo3418hQxogCiIBjwqSH7-o8R_Cnz-Gp6pkoloVq8IquLm60PcYw5duJ1IfEAcCcSJSHDY0zhbhgIvT4bIZorxnXIotwabwG36-VfsSnRU9beg21Jp7F2_S72xQrFzUEFv-GCQ1QD2KVl1UYC9IjDBSRYc3Z7tOEenrvn1LQsImqYRplDGpW4pCNcpaTdhi3kBLwiFyLpxKBEYy1BI6NJZ80NTyxtiRI4WXgtb7nLicz-GJXD4lfY856eb_6RRAzYQjS6FAEAgwJQ6luqli1QOjUPsBUK7rbnNZ3wCpXsrKzbf0IlSK8OnKCefv4zyZ_Cr3Ajw8ZjgCQQ5soZKBR8Zu6v9BTGiJAR_sFfUd3hM3QwGcLUE83Z-uAqn0Qtlx-j3TdCDnCM62il7XQ5Yvq-dfpuwp6C0aliWtC3iKG9FAcxHq_wrQ4ls2lZDz_ntqN5oGkkCM_j5TjZKYFy_cos1XtHGK8Lqn3076O-0_2i3VH68ClAVMnp3l6KWY15PSslNNR6HaxgnA-AjY9Gi9rdb34ME5VWQJg2A4do-j4QIJ8lAb5eWw-Ya-I5OoOmPX8aMrqE9vahh-mYcorl4iLwJY2B4s63tIacUoEhEVviytx1ASUgL9n6tCUtrCOJ9QR18cXCJXerzDeykT34ZugR5H0aY1k7QF2GtK0aCSiqgpB7YsAlsjK2RBdBuQrQroNN-243d8fJbkHRezxws54Jt0NbXbQf56Jdn7Xp5xwW8uDVUhCMvcy5EcnF258nEggjEpDrLBezw__7-y0fd51aOwptWZ4hWRXN3JAHzASb7zL_bekoPe9WZ8NaZL49V_e_MYRAGWWMbiPXfoh4XIUJy3jBfjVcvVetUCodVP49MGafKGfmnxd4TbhiPL7oOvQcZtlC08sxO-BV-57-jxnrwVz8fLvPQrCOnzCYoyQqKj0PeG0S7JDcC0uN8V_u0OPfDMlOmIMZ_eTX6Z3taVX2YbvutXIOVSrUT-GIEnuRMVj3X2GnOxlrqGoXVjgZyBGiCL5XUnSqFW89esMWkCMYffO6cVZqrzLmJXjrT3TBuO_g3GwMqy_cFt2VIMPhoAVqwAii4YHmMzrC1YtnEteJPC-wP4x-uqkS8N05tWlTzo8KlJAttQTHHPC0RBLWQr5uD2NkVqL0lhgBT-0MsJJooSbd_Wp4QCOSz-D450LgSeA9QTi2RFIJQmfxFRqaFXItSEo2KF4_yjAtgYlBgtUjRyU_1Nfg=s320-w320-h200-p-k";

 // Create the request to replace shapes in the
 // presentation with the logo. Any shape with the text
 // {{logo_image}} in it will be replaced with the image.
 var mergeImageRequests = [{
   replaceAllShapesWithImage: {
     imageUrl: logoUrl,
     containsText: {
       text: '{{logo_image}}'
     }
   }
 }];

 // Send the request to merge the logo into the presentation
 Slides.Presentations.batchUpdate({
   requests: mergeImageRequests
 }, templateId);
}

function mergeLazadaLogo() {
  var templateId = SlidesApp.getActivePresentation().getId();

  //Logo url
  var logoUrl = "https://seeklogo.com/images/L/lazada-logo-B0415CCF29-seeklogo.com.png";

 // Create the request to replace shapes in the
 // presentation with the logo. Any shape with the text
 // {{logo_image}} in it will be replaced with the image.
 var mergeImageRequests = [{
   replaceAllShapesWithImage: {
     imageUrl: logoUrl,
     containsText: {
       text: '{{lazada_logo}}'
     }
   }
 }];

 // Send the request to merge the logo into the presentation
 Slides.Presentations.batchUpdate({
   requests: mergeImageRequests
 }, templateId);
}

function mergeShopeeLogo() {
  var templateId = SlidesApp.getActivePresentation().getId();

  //Logo url
  var logoUrl = "https://1000logos.net/wp-content/uploads/2021/02/Shopee-logo.png";

 // Create the request to replace shapes in the
 // presentation with the logo. Any shape with the text
 // {{logo_image}} in it will be replaced with the image.
 var mergeImageRequests = [{
   replaceAllShapesWithImage: {
     imageUrl: logoUrl,
     containsText: {
       text: '{{shopee_logo}}'
     }
   }
 }];

 // Send the request to merge the logo into the presentation
 Slides.Presentations.batchUpdate({
   requests: mergeImageRequests
 }, templateId);
}