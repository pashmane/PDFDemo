public class PrintExtension {
    public PrintExtension(ApexPages.StandardController controller) {
        
    }
    @AuraEnabled
    public Static Object getEmailMessageData(Id recordId){
        List<EmailMessage> lstEmailData = [Select Id, Subject, HtmlBody,TextBody from EmailMessage where id =:recordId];
        return lstEmailData[0]; 
    }
    @AuraEnabled 
    public String getReferer(){ 
        String currentParam = ApexPages.currentPage().getparameters().get('ID'); 
        List<EmailMessage> lstEmail = [Select id, HtmlBody From EmailMessage Where Id =:currentParam ];
        return lstEmail[0].HtmlBody;
        //String baseURL =   URL.getSalesforceBaseUrl().toExternalForm();
        //return baseURL;
        //return String.valueOf(ApexPages.currentPage());
    }
    @AuraEnabled(cacheable=true)
    public static list<EmailMessage> getAccounts(Id recordId){
        System.debug('recordId-->'+recordId);
        List<EmailMessage> lstEmail = [Select Id, Subject, HtmlBody, TextBody from EmailMessage where id =:recordId];
        System.debug('lstEmail-->'+lstEmail);
        return lstEmail;
    }
}