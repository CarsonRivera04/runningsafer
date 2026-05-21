export const ActivityCard = () => {
  const STROKEWIDTH = 3;
  const STROKECOLOR = "f44";
  const STROKEOPACITY = 1;
  
  const POLYLINE_UNSAFE = "qryxDdcqaOtDKvBFzECp@@pAH|B@`@ChA@XJf@Cn@Bf@LfAJ\\AZGbBDv@o@p@o@~@a@?Ea@JGGLMKqDBo@CgAQWMg@BaCHc@Ao@Hm@Rc@LK^Qh@OHQF}@ZeBFkA?i@?MKQ}@AWOGe@Yi@I[AMDsEKkCD]Bo@@{HD{BC{DCYBYAsADu@?k@Ai@DuBIeAB_BC}A@kCGCYAkABm@?c@BmDCMBk@Ao@FkAGw@?{BI}@FERFtAE`AD|ABd@?bB@sAG{@EiB?{BBYJEVAtADd@F\\?fDI`A@zAG`@?JBpCCd@?B@FHFv@FhHCxCC^BVGtC?r@Dv@?jB@r@Gb@NtCE|@Hz@EhCFdDDn@Ar@Dj@Ej@EVGx@Qn@[n@?FLVd@?^E|AEJ?NP@FAx@WtBGTa@xCOr@@^Zj@C`@MF_@^]j@Sj@YZ?PZ`@Hf@HRCTAh@Bx@EnAB`@AJITBH\\E@BqA@q@J]HeAxAQD]@gA@eAOk@a@s@BwDAyCBkCEsCB";
  
  // 2. Safe URL encoding for the polyline string
  const POLYLINE = encodeURIComponent(POLYLINE_UNSAFE);

  const USERNAME = "mapbox";
  const STYLE_ID = "streets-v12";
  const OVERLAY = `path-${STROKEWIDTH}+${STROKECOLOR}-${STROKEOPACITY}(${POLYLINE})`;
  const OTHER = "auto";
  const WIDTH = 500;
  const HEIGHT = 300;
  
  const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

  // 3. Construct the final URL with the access token as a query parameter
  const mapboxImageUrl = `https://api.mapbox.com/styles/v1/${USERNAME}/${STYLE_ID}/static/${OVERLAY}/${OTHER}/${WIDTH}x${HEIGHT}?access_token=${ACCESS_TOKEN}`;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h3>Activity Card</h3>
      <img 
        src={mapboxImageUrl} 
        alt="Mapbox static route overlay" 
        width={WIDTH} 
        height={HEIGHT}
        style={{ borderRadius: '8px', display: 'block', marginTop: '8px' }}
      />
    </div>
  );
}