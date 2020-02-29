exports.data = `<div id="modalTpl" class="modal fade" tabindex="-1" role="dialog">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header bg-<% if (data.type == "success"){ %>success<% } else{ %>danger<% } %>">
            <h5 class="modal-title text-white"><% if (data.type == "success"){ %><%=data.message%><% } else{ %>Erreur :<% } %></h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="container">
                <div class="row">
                    <div class="col-8 font-weight-bold d-flex align-items-center">
                        <% if (data.type == "error") { %>
                            <%=data.message%> 
                        <% } %>
                    </div>
                    

                    <% if (data.type == "success"){ %>
                        <div class="col-lg-12 p-0 py-3 d-flex align-items-center">
                            <div class="row col-12">
                                <div data-id="<%= data.newUrl.id%>" class="col-10 d-flex align-items-center text-break">
                                    <%= data.siteUrl%>url/<%= data.newUrl.id%>
                                </div>
                                <div class="col-2 text-right">
                                    <button data-copy-id="<%= data.newUrl.id%>" type="button" class="btn" data-toggle="tooltip" data-placement="top" title="Copier le lien">
                                        <i class="far fa-clipboard"></i>
                                    </button>

                                </div>
                            </div>
                                
                        </div>

                        <div class="col-12 pb-2">
                            <a data-id="<%= data.newUrl.id%>" class="btn btn-primary" href="">Génerer le Qr Code</a>
                        </div>

                            
                        

                        <div class="col-12">
                            <div class="row border-top">
                                <div class="col-12 mt-3 text-secondary">Vous pouvez des a présent copiez votre lien ci-dessus.</div>
                                <div class="col-12 mb-3 text-secondary">Merci d'avoir utiliser smart-url !</div>
                                <div class="col-12 text-right" style="opacity: .5;">
                                    <i class="fas display-4 text-success fa-smile-wink"></i>
                                </div> 
                            </div>
                        </div>

                    <%} else {%>
                        <div class="col-12 text-right" style="opacity: .5;">
                            <i class="fas display-4 text-danger fa-sad-tear"></i>
                        </div>
                    <% } %>
                    <div id="qrcode" class="col-12 text-center">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>`