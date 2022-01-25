({
    printData : function(component, event, helper){
       var pageReference = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__TabComponent'
            },
            state: {
                c__refRecordId: component.get("v.emailMessageData")
            }
        };
        debugger;
        component.set("v.pageReference", pageReference);
        const navService = component.find('navService');
        const pageRef = component.get('v.pageReference');
        const handleUrl = (url) => {
            window.open(url);
        };
        const handleError = (error) => {
            console.log(error);
        };
        window.open(pageRef, '_blank');
        //navService.generateUrl(pageRef).then(handleUrl, handleError);
    },
    doInit : function(component, event, helper) {
        debugger;
        var action = component.get("c.getEmailMessageData");
        action.setParams({recordId : component.get("v.emailMessageId")});
        
        // Call back method
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let emailMessageData = response.getReturnValue();
                component.set("v.emailMessageData",emailMessageData);
                //alert("From server: " + response.getReturnValue());
            }
            
            else if (state === "ERROR") {
                
                var errors = response.getError();
                
                alert(JSON.stringify(errors));
            }
        });
        // Enqueue Action
        $A.enqueueAction(action);
    }
})