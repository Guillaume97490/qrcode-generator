exports.data = `
        <% data.urls.forEach(function(url) { %>
                    
            <div class="mb-1 col-12">
                <div class="py-2 url-item">
                    <div class="row">

                        <div class="col-lg-12 d-flex align-items-center">
                            <div class="row col-12 d-flex align-items-center">
                                <div class="col-10">
                                    <a class="text-white text-break" data-qr-id="<%= url._id%>" href="" target="_blank" rel="noopener noreferrer"><%= data. siteUrl%>url/<%= url._id%></a>
                                </div>
                                <div class="col-2 text-right">
                                    <button data-copy-id="<%= url._id%>" type="button" class="btn" data-toggle="tooltip" data-placement="top" title="Copier le lien">
                                        <i class="far text-white fa-clipboard"></i>
                                    </button>

                                </div>
                            </div>
                                
                        </div>

                    </div>
                    
                </div>
            </div>
        <%  }) %>
`