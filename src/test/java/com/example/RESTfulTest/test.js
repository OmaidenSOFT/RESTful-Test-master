@SpringBootTest
@AutoConfigureMockMvc
class WidgetRestControllerTest {

  @MockBean
    private WidgetService service;

    @Autowired
    private MockMvc mockMvc;



   

}
@Test
@DisplayName("GET /widgets success")
void testGetWidgetsSuccess() throws Exception {
    Widget widget1 = new Widget(1l, "Widget Name", "Description", 1);
    Widget widget2 = new Widget(2l, "Widget 2 Name", "Description 2", 4);
    doReturn(Lists.newArrayList(widget1, widget2)).when(service).findAll();

    mockMvc.perform(get("/rest/widgets"))
            .andExpect(status().isOk())
       .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(header().string(HttpHeaders.LOCATION, "/rest/widgets"))
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id", is(1)))
            .andExpect(jsonPath("$[0].name", is("Widget Name")))
            .andExpect(jsonPath("$[0].description", is("Description")))
            .andExpect(jsonPath("$[0].version", is(1)))
            .andExpect(jsonPath("$[1].id", is(2)))
            .andExpect(jsonPath("$[1].name", is("Widget 2 Name")))
            .andExpect(jsonPath("$[1].description", is("Description 2")))
            .andExpect(jsonPath("$[1].version", is(4)));
}


@Test
@DisplayName("POST /rest/widget")
void testCreateWidget() throws Exception {
    Widget widgetToPost = new Widget("New Widget", "This is my widget");
    Widget widgetToReturn = new Widget(1L, "New Widget", "This is my widget", 1);
    doReturn(widgetToReturn).when(service).save(any());

    mockMvc.perform(post("/rest/widget")
            .contentType(MediaType.APPLICATION_JSON)
            .content(asJsonString(widgetToPost)))
                     .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                     .andExpect(header().string(HttpHeaders.LOCATION, "/rest/widget/1"))
            .andExpect(header().string(HttpHeaders.ETAG, "\"1\""))
                     .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.name", is("New Widget")))
            .andExpect(jsonPath("$.description", is("This is my widget")))
            .andExpect(jsonPath("$.version", is(1)));
}
@Test
@DisplayName("GET /rest/widget/1 - Not Found")
void testGetWidgetByIdNotFound() throws Exception {
    doReturn(Optional.empty()).when(service).findById(1l);

    mockMvc.perform(get("/rest/widget/{id}", 1L))
            .andExpect(status().isNotFound());
}
